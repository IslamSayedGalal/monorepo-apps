export interface TagProps {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Tag {
  private readonly _id?: string;
  private _name: string;
  private _slug: string;
  private _description?: string;
  private _color?: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: TagProps) {
    this._id = props.id;
    this._name = props.name;
    this._slug = props.slug;
    this._description = props.description;
    this._color = props.color;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string | undefined {
    return this._description;
  }

  get color(): string | undefined {
    return this._color;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(name: string): void {
    this._name = name;
    this._slug = Tag.createSlug(name);
    this._updatedAt = new Date();
  }

  updateDescription(description: string | undefined): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  updateColor(color: string | undefined): void {
    this._color = color;
    this._updatedAt = new Date();
  }

  static createSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static create(props: Omit<TagProps, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Tag {
    return new Tag({
      ...props,
      slug: Tag.createSlug(props.name),
    });
  }
}

