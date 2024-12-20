function RuleBox(props){
    
    return(
        <div className='flex'>
            {props.children}
            <div className='text-white text-2xl m-16'>
                Add text about how to play game here
            </div>
        </div>
        
    );
}

export default RuleBox;