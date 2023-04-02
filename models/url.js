const mongoose = require("mongoose");

const urlSchema = mongoose.Schema(
    {
        urlOriginal: {
            type: String,
            required: true
        },
        urlShortened: {
            type: String,
            required : true,
            unique: true
        }
    }
)

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;