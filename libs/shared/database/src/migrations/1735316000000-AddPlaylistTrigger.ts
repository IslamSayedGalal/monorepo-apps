import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlaylistTrigger1735316000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create a function to generate playlist slug from name
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION generate_playlist_slug()
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
            base_slug := 'playlist';
          END IF;

          generated_slug := base_slug;
          slug_counter := 0;

          -- Check if slug exists and append number if needed
          SELECT EXISTS(SELECT 1 FROM playlists WHERE slug = generated_slug AND (TG_OP = 'INSERT' OR id != NEW.id)) INTO slug_exists;

          WHILE slug_exists LOOP
            slug_counter := slug_counter + 1;
            generated_slug := base_slug || '-' || slug_counter;
            SELECT EXISTS(SELECT 1 FROM playlists WHERE slug = generated_slug AND (TG_OP = 'INSERT' OR id != NEW.id)) INTO slug_exists;
          END LOOP;

          NEW.slug := generated_slug;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create a function to generate playlist code from name
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION generate_playlist_code()
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

          -- Combine to create code: PL-{timestamp}-{name_hash}-{random}
          unique_code := 'PL-' || timestamp_part || '-' || name_hash || '-' || random_part;

          -- Check if code already exists (very unlikely but safe)
          SELECT EXISTS(SELECT 1 FROM playlists WHERE code = unique_code AND (TG_OP = 'INSERT' OR id != NEW.id)) INTO code_exists;

          -- If code exists, add more randomness
          WHILE code_exists LOOP
            random_part := UPPER(SUBSTRING(MD5(RANDOM()::text || NOW()::text || random_part || NEW.name) FROM 1 FOR 8));
            unique_code := 'PL-' || timestamp_part || '-' || name_hash || '-' || random_part;
            SELECT EXISTS(SELECT 1 FROM playlists WHERE code = unique_code AND (TG_OP = 'INSERT' OR id != NEW.id)) INTO code_exists;
          END LOOP;

          NEW.code := unique_code;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create trigger for slug generation
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_generate_playlist_slug ON playlists;
      CREATE TRIGGER trigger_generate_playlist_slug
        BEFORE INSERT OR UPDATE ON playlists
        FOR EACH ROW
        EXECUTE FUNCTION generate_playlist_slug();
    `);

    // Create trigger for code generation
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_generate_playlist_code ON playlists;
      CREATE TRIGGER trigger_generate_playlist_code
        BEFORE INSERT OR UPDATE ON playlists
        FOR EACH ROW
        EXECUTE FUNCTION generate_playlist_code();
    `);

    // Update existing playlists that have NULL or empty slugs
    await queryRunner.query(`
      UPDATE playlists
      SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(COALESCE(name, 'playlist'), '[^a-zA-Z0-9 ]', '', 'g'), ' +', '-', 'g')) || '-' || id
      WHERE slug IS NULL OR slug = '';
    `);

    // Update existing playlists that have NULL or empty codes
    await queryRunner.query(`
      UPDATE playlists
      SET code = 'PL-' ||
        TO_CHAR(EXTRACT(EPOCH FROM NOW())::bigint * 1000, 'FM999999999999999') ||
        '-' ||
        UPPER(SUBSTRING(MD5(RANDOM()::text || id::text || NOW()::text) FROM 1 FOR 8))
      WHERE code IS NULL OR code = '';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_generate_playlist_slug ON playlists;
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_generate_playlist_code ON playlists;
    `);

    // Drop functions
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS generate_playlist_slug();
    `);

    await queryRunner.query(`
      DROP FUNCTION IF EXISTS generate_playlist_code();
    `);
  }
}
