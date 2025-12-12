import mongoose from 'mongoose';

const WidgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this widget.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this widget.'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
  },
}, { timestamps: true });

export default mongoose.models.Widget || mongoose.model('Widget', WidgetSchema);
