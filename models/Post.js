const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Post
const PostSchema = new Schema({
  title: { type: String, required: true, trim: true, index: true },
  slug: { type: String, lowercase: true, required: true, trim: true, unique: true, index: true },
  content: { type: String },
  status: { type: String, default: 'Draft', enum: ['Published', 'Draft'], required: true },
  category: [{ type: Schema.Types.ObjectId, ref: 'category', many: true, required: true }],
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  type: { type: String, default: 'post' }
}, {
    timestamps: true
  });

PostSchema.statics.slugify = function (string) {
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

const Post = mongoose.model('post', PostSchema);

module.exports = Post;