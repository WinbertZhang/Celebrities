function OptionsButton(props){
    return (
        <div className='flex mx-4 my-4'>
            {props.children}
                <button className="bg-purple-500 rounded-full px-4 py-2 text-white drop-shadow-xl" >{props.buttonText}</button>
        </div>
    )
}

export default OptionsButton;
