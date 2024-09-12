
const Stars = ({ selected = false, onClick = e => e }) => {

   return  <div className={
        selected ? 'star selected' : 'star'}
        onClick={onClick}>
         ★
    </div>
}


export default Stars;