function RuleBox(props){
    return(
        <div className='flex'>
            {props.children}
            <div className='text-white text-4xl m-8'>
                Add text about how to play game here
            </div>
        </div>
        
    );
}

export default RuleBox;