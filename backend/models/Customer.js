const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  car: {
    year: {
      type: Number,
      required: [true, 'Please add car year']
    },
    make: {
      type: String,
      required: [true, 'Please add car make']
    },
    model: {
      type: String,
      required: [true, 'Please add car model']
    },
    vin: {
      type: String,
      required: [true, 'Please add VIN number'],
      unique: true
    },
    containerNumber: {
      type: String,
      required: [true, 'Please add container number']
    },
    portOfLoading: {
      type: String,
      required: [true, 'Please add port of loading']
    },
    loadingDate: {
      type: Date,
      required: [true, 'Please add loading date']
    },
    openingDate: {
      type: Date,
      required: [true, 'Please add opening date']
    },
    trackingLinks: {
      carrier: {
        type: String,
        required: [true, 'Please add carrier tracking link']
      },
      ship: {
        type: String,
        required: [true, 'Please add ship tracking link']
      }
    },
    saleDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'in_transit', 'arrived', 'sold'],
      default: 'pending'
    }
  },
  images: {
    auction: [{
      type: String,
      required: [true, 'Please add auction images']
    }],
    americanDepot: [{
      type: String,
      required: [true, 'Please add American depot images']
    }],
    containerLoading: [{
      type: String,
      required: [true, 'Please add container loading images']
    }],
    containerUnloading: [{
      type: String,
      required: [true, 'Please add container unloading images']
    }],
    bakuRoad: [{
      type: String,
      required: [true, 'Please add Baku road images']
    }],
    bakuCustoms: [{
      type: String,
      required: [true, 'Please add Baku customs images']
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Customer', CustomerSchema); 