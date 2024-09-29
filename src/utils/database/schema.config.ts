export const mongooseSchemaConfig = {
  id: true,
  versionKey: false,
  timestamps: true,
  autoIndex: true,
  toJSON: {
    virtuals: true,
    transform: (
      _: unknown,
      ret: {
        _id?: string;
      },
    ): unknown => {
      // TODO: delete all fields not required on the frontend
      delete ret._id;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (
      _: unknown,
      ret: {
        _id?: string;
      },
    ): unknown => {
      delete ret._id;
      return ret;
    },
  },
};
