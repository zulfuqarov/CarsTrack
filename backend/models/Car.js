const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: true
  },
  carInfo: {
    year: {
      type: Number,
      required: true
    },
    make: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    vin: {
      type: String,
      required: true,
      unique: true
    },
    saleDate: {
      type: Date,
      required: true
    }
  },
  shippingInfo: {
    containerNumber: {
      type: String,
      required: true
    },
    portOfLoading: {
      type: String,
      required: true
    },
    carrier: {
      type: String,
      required: true
    },
    loadingDate: {
      type: Date,
      required: true
    },
    openingDate: {
      type: Date,
      required: true
    },
    trackingLinks: {
      carrier: {
        type: String,
        required: true
      },
      liveMap: {
        type: String,
        required: true
      }
    }
  },
  status: {
    type: String,
    enum: ['In Transit', 'In Customs', 'Delivered'],
    default: 'In Transit'
  },
  photos: {
    auction: [String],
    usaWarehouse: [String],
    containerLoading: [String],
    containerUnloading: [String],
    bakuRoad: [String],
    bakuCustoms: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
CarSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Car', CarSchema); 