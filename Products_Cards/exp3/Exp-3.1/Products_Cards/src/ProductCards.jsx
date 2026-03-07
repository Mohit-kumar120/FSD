import './ProductCards.css'
function ProductCards() {
  return (
    <>
    <h1 className='heading'>Welcome to Experiment 3.1</h1>
      <div className='card'>
        <h3>Wireless Mouse</h3>
        <p>Price : $29.33</p>
        <p>In Stock</p>
      </div>
      <div className='card'>
        <h3>Music KeyBoard</h3>
        <p>Price : $399.33</p>
        <p>Out Stock</p>
      </div>
      <div className='card'>
        <h3>Mackbook Pro</h3>
        <p>Price : $1157.33</p>
        <p>In Stock</p>
      </div>
    </>
  );
}
export default ProductCards;
