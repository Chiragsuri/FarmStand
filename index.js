const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override');


mongoose.set('strictQuery', true);

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/farmStand');
    console.log("MONGO CONNECTION OPEN!!!")
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


//middle wares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

//category define kr rha hu
const categories = ['fruit', 'vegetable', 'dairy'];

//Sending data to index.ejs file
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
    }
})
//


//new 
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

//post req
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
})


//details page//
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
})

//update 
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories })
})


//PUT REQ
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    console.log(req.body);
    res.redirect(`/products/${newProduct._id}`);
})


//DELETE
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})




//listening on port
app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})
