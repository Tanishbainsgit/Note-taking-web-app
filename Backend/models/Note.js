const mongoose = require('mongoose');

// Create Note Schema with optimized structure for Task 10
const noteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // Reference to User collection (future scalability)
    required: true 
  },
  title: { 
    type: String, 
    required: true, 
    maxlength: 100, 
    index: true  // Index for faster searching by title
  },
  content: { 
    type: String, 
    required: true, 
    maxlength: 5000 
  },
  tags: [{ 
    type: String 
  }],
  archived: { 
    type: Boolean, 
    default: false 
  },
  createdDate: { 
    type: Date, 
    default: Date.now 
  },
  updatedDate: { 
    type: Date 
  }
});

// Create additional index on userId for search optimization
noteSchema.index({ userId: 1 });

module.exports = mongoose.model('Note', noteSchema);
