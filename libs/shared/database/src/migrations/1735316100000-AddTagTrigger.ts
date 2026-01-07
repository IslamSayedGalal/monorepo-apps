import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTagTrigger1735316100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create a function to generate tag slug from name
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION generate_tag_slug()
      RETURNS TRIGGER AS $$
      DECLARE
        generated_slug TEXT;
        slug_exists BOOLEAN;
        base_slug TEXT;
        slug_counter INTEGER;
      BEGIN
        -- Generate slug from name if it's NULL or empty
        IF NEW.slug IS NULL OR NEW.slug = '' THEN
          -- Convert name to slug: lowercase, replace spaces with hyphens, remove special chars
          base_slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9 ]', '', 'g'), ' +', '-', 'g'));
          base_slug := TRIM(BOTH '-' FROM base_slug);

          -- Ensure slug is not empty
          IF base_slug = '' THEN
            base_slug := 'tag';
          END IF;

          generated_slug := base_slug;
          slug_counter := 0;

          -- Check if slug exists and append number if needed
          SELECT EXISTS(SELECT 1 FROM tags WHERE slug = generated_slug AND (TG_OP = 'INSERT' OR id != NEW.id)) INTO slug_exists;

          WHILE slug_exists LOOP
            slug_counter := slug_counter + 1;
            generated_slug := base_slug || '-' || slug_counter;
            SELECT EXISTS(SELECT 1 FROM tags WHERE slug = generated_slug AND (TG_OP = 'INSERT' OR id != NEW.id)) INTO slug_exists;
          END LOOP;

          NEW.slug := generated_slug;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create a function to generate tag code from name
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION generate_tag_code()
      RETURNS TRIGGER AS $$
      DECLARE
        timestamp_part TEXT;
        random_part TEXT;
        unique_code TEXT;
        code_exists BOOLEAN;
        name_hash TEXT;
      BEGIN
        -- Generate code only if it's NULL or empty
        IF NEW.code IS NULL OR NEW.code = '' THEN
          -- Generate timestamp part (epoch in milliseconds for better uniqueness)
          timestamp_part := TO_CHAR(EXTRACT(EPOCH FROM NOW())::bigint * 1000, 'FM999999999999999');

          -- Generate hash from name for additional uniqueness
          name_hash := UPPER(SUBSTRING(MD5(NEW.name || NOW()::text) FROM 1 FOR 6));

          -- Generate random part
          random_part := UPPER(SUBSTRING(MD5(RANDOM()::text || NEW.name || NOW()::text) FROM 1 FOR 8));

          -- Combine to create code: TAG-{timestamp}-{name_hash}-{random}
          unique_code := 'TAG-' || timestamp_part || '-' || name_hash || '-' || random_part;

          -- Check if code already exists (very unlikely but safe)
          SELECT EXISTS(SELECT 1 FROM tags WHERE code = unique_code AND (TG_OP = 'INSERT' OR id != NEW.id)) INTO code_exists;

          -- If code exists, add more randomness
          WHILE code_exists LOOP
            random_part := UPPER(SUBSTRING(MD5(RANDOM()::text || NOW()::text || random_part || NEW.name) FROM 1 FOR 8));
            unique_code := 'TAG-' || timestamp_part || '-' || name_hash || '-' || random_part;
            SELECT EXISTS(SELECT 1 FROM tags WHERE code = unique_code AND (TG_OP = 'INSERT' OR id != NEW.id)) INTO code_exists;
          END LOOP;

          NEW.code := unique_code;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create trigger for slug generation
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_generate_tag_slug ON tags;
      CREATE TRIGGER trigger_generate_tag_slug
        BEFORE INSERT OR UPDATE ON tags
        FOR EACH ROW
        EXECUTE FUNCTION generate_tag_slug();
    `);

    // Create trigger for code generation
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_generate_tag_code ON tags;
      CREATE TRIGGER trigger_generate_tag_code
        BEFORE INSERT OR UPDATE ON tags
        FOR EACH ROW
        EXECUTE FUNCTION generate_tag_code();
    `);

    // Update existing tags that have NULL or empty slugs
    await queryRunner.query(`
      UPDATE tags
      SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(COALESCE(name, 'tag'), '[^a-zA-Z0-9 ]', '', 'g'), ' +', '-', 'g')) || '-' || id
      WHERE slug IS NULL OR slug = '';
    `);

    // Update existing tags that have NULL or empty codes
    await queryRunner.query(`
      UPDATE tags
      SET code = 'TAG-' ||
        TO_CHAR(EXTRACT(EPOCH FROM NOW())::bigint * 1000, 'FM999999999999999') ||
        '-' ||
        UPPER(SUBSTRING(MD5(RANDOM()::text || id::text || NOW()::text) FROM 1 FOR 8))
      WHERE code IS NULL OR code = '';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_generate_tag_slug ON tags;
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_generate_tag_code ON tags;
    `);

    // Drop functions
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS generate_tag_slug();
    `);

    await queryRunner.query(`
      DROP FUNCTION IF EXISTS generate_tag_code();
    `);
  }
}
