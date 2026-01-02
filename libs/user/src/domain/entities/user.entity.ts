import { BaseEntity, BaseEntityProps } from '@my-workspace/shared-common';
import { Email } from '../value-objects/email.vo';
import { UserStatus } from '../enums/user-status.enum';
import { AuthProvider } from '../enums/auth-provider.enum';

export interface UserProps extends BaseEntityProps {
  login: string;
  email: Email;
  password?: string;
  firstName?: string;
  lastName?: string;
  status: UserStatus;
  imageUrl?: string;
  coverUrl?: string;
  country?: string;
  city?: string;
  bio?: string;
  phoneNumber?: string;
  provider: AuthProvider;
  firebaseUid?: string;
  lastLogin?: Date;
}

export class User extends BaseEntity {
  private _login: string;
  private _email: Email;
  private _password?: string;
  private _firstName?: string;
  private _lastName?: string;
  private _status: UserStatus;
  private _imageUrl?: string;
  private _coverUrl?: string;
  private _country?: string;
  private _city?: string;
  private _bio?: string;
  private _phoneNumber?: string;
  private _provider: AuthProvider;
  private _firebaseUid?: string;
  private _lastLogin?: Date;

  private constructor(props: UserProps) {
    super(props);
    this._login = props.login;
    this._email = props.email;
    this._password = props.password;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._status = props.status;
    this._imageUrl = props.imageUrl;
    this._coverUrl = props.coverUrl;
    this._country = props.country;
    this._city = props.city;
    this._bio = props.bio;
    this._phoneNumber = props.phoneNumber;
    this._provider = props.provider;
    this._firebaseUid = props.firebaseUid;
    this._lastLogin = props.lastLogin;
  }

  // ============ Getters ============

  get login(): string {
    return this._login;
  }

  get email(): Email {
    return this._email;
  }

  get password(): string | undefined {
    return this._password;
  }

  get firstName(): string | undefined {
    return this._firstName;
  }

  get lastName(): string | undefined {
    return this._lastName;
  }

  get fullName(): string {
    return [this._firstName, this._lastName].filter(Boolean).join(' ');
  }

  get status(): UserStatus {
    return this._status;
  }

  get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  get coverUrl(): string | undefined {
    return this._coverUrl;
  }

  get country(): string | undefined {
    return this._country;
  }

  get city(): string | undefined {
    return this._city;
  }

  get bio(): string | undefined {
    return this._bio;
  }

  get phoneNumber(): string | undefined {
    return this._phoneNumber;
  }

  get provider(): AuthProvider {
    return this._provider;
  }

  get firebaseUid(): string | undefined {
    return this._firebaseUid;
  }

  get lastLogin(): Date | undefined {
    return this._lastLogin;
  }

  // ============ Status Checks ============

  get isPending(): boolean {
    return this._status === UserStatus.PENDING;
  }

  get isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  get isSuspended(): boolean {
    return this._status === UserStatus.SUSPENDED;
  }

  get isBanned(): boolean {
    return this._status === UserStatus.BANNED;
  }

  // ============ Domain Behavior ============

  activate(): void {
    this._status = UserStatus.ACTIVE;
    this.touch();
  }

  suspend(): void {
    if (this.isBanned) {
      throw new Error('Cannot suspend a banned user');
    }
    this._status = UserStatus.SUSPENDED;
    this.touch();
  }

  ban(): void {
    this._status = UserStatus.BANNED;
    this.touch();
  }

  reactivate(): void {
    if (this.isBanned) {
      throw new Error('Cannot reactivate a banned user');
    }
    this._status = UserStatus.ACTIVE;
    this.touch();
  }

  updateProfile(data: {
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    coverUrl?: string;
    country?: string;
    city?: string;
    bio?: string;
    phoneNumber?: string;
  }): void {
    if (data.firstName !== undefined) this._firstName = data.firstName;
    if (data.lastName !== undefined) this._lastName = data.lastName;
    if (data.imageUrl !== undefined) this._imageUrl = data.imageUrl;
    if (data.coverUrl !== undefined) this._coverUrl = data.coverUrl;
    if (data.country !== undefined) this._country = data.country;
    if (data.city !== undefined) this._city = data.city;
    if (data.bio !== undefined) this._bio = data.bio;
    if (data.phoneNumber !== undefined) this._phoneNumber = data.phoneNumber;
    this.touch();
  }

  updateEmail(email: Email): void {
    this._email = email;
    this.touch();
  }

  updatePassword(hashedPassword: string): void {
    this._password = hashedPassword;
    this.touch();
  }

  recordLogin(): void {
    this._lastLogin = new Date();
    this.touch();
  }

  // ============ Factory Methods ============

  static create(
    props: Omit<UserProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): User {
    return new User({
      ...props,
      status: UserStatus.PENDING,
    });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }
}
