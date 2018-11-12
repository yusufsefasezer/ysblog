const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Category
const CategorySchema = new Schema({
  name: { type: String, trim: true, required: true },
  slug: { type: String, lowercase: true, required: true, trim: true, unique: true, index: true },
  parent: { type: Schema.Types.ObjectId, ref: 'category', default: null },
}, {
    timestamps: true
  });

CategorySchema.statics.slugify = function (string) {
  const a = 'àáäâãåèéëêìíïîıòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
  const b = 'aaaaaaeeeeiiiiıoooouuuuncsyoarsnpwgnmuxzh------'
  const p = new RegExp(a.split('').join('|'), 'g')
  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with ‘and’
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple — with single -
    .replace(/^-+/, '') // Trim — from start of text .replace(/-+$/, '') // Trim — from end of text
};

const Category = mongoose.model('category', CategorySchema);

module.exports = Category;