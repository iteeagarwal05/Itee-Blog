export const softDeletePlugin = (schema) => {
    schema.add({ isDeleted: { type:Boolean, default: false}, deletedAt: { type: Date, default: null } } );

    const autoExcludeDeleted = function (next) {
        if(!this.getFilter().isDeleted) {
            this.where({ isDeleted: false });
        }
        next();
    };

    schema.pre('find', autoExcludeDeleted);
    schema.pre('findOne', autoExcludeDeleted);
    schema.pre('findById', autoExcludeDeleted);
    schema.pre('findOneAndUpdate', autoExcludeDeleted);
}