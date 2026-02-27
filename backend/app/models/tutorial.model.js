module.exports = mongoose => {
  const mongoosePaginate = require('mongoose-paginate-v2');

  var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      published: Boolean,
      pinned: Boolean,
      rating: { type: Number, default: 0 }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.plugin(mongoosePaginate);

  const Tutorial = mongoose.model("tutorial", schema);
  return Tutorial;
};
