/**
 * Presenter Model
 *
 * Database model for radio show presenters.
 *
 * TODO: Implement using Sequelize or TypeORM
 */

interface SocialLinks {
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

export interface PresenterAttributes {
  id: number;
  name: string;
  bio: string;
  imageUrl?: string;
  imageLocalPath?: string;
  socials?: SocialLinks;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Example Sequelize Model Definition:
 *
 * import { Model, DataTypes } from 'sequelize';
 * import sequelize from '../config/database';
 *
 * class Presenter extends Model<PresenterAttributes> implements PresenterAttributes {
 *   public id!: number;
 *   public name!: string;
 *   public bio!: string;
 *   public imageUrl?: string;
 *   public imageLocalPath?: string;
 *   public socials?: SocialLinks;
 *   public isArchived!: boolean;
 *   public archivedAt?: Date;
 *   public readonly createdAt!: Date;
 *   public readonly updatedAt!: Date;
 * }
 *
 * Presenter.init(
 *   {
 *     id: {
 *       type: DataTypes.INTEGER,
 *       autoIncrement: true,
 *       primaryKey: true,
 *     },
 *     name: {
 *       type: DataTypes.STRING(255),
 *       allowNull: false,
 *     },
 *     bio: {
 *       type: DataTypes.TEXT,
 *       allowNull: true,
 *     },
 *     imageUrl: {
 *       type: DataTypes.STRING(500),
 *       allowNull: true,
 *     },
 *     imageLocalPath: {
 *       type: DataTypes.STRING(500),
 *       allowNull: true,
 *     },
 *     socials: {
 *       type: DataTypes.JSONB,
 *       allowNull: true,
 *     },
 *     isArchived: {
 *       type: DataTypes.BOOLEAN,
 *       defaultValue: false,
 *       allowNull: false,
 *     },
 *     archivedAt: {
 *       type: DataTypes.DATE,
 *       allowNull: true,
 *     },
 *   },
 *   {
 *     sequelize,
 *     tableName: 'presenters',
 *     timestamps: true,
 *   }
 * );
 *
 * export default Presenter;
 */
