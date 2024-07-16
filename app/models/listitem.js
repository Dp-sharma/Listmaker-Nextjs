import mongoose from 'mongoose';

const ListItemSchema = new mongoose.Schema({
  items: {
    type: [String],
    required: true,
  },
});

const ListItem = mongoose.models.ListItem || mongoose.model('ListItem', ListItemSchema);

export default ListItem;
