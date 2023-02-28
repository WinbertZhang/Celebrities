function Profile(props){
    return(
        <div className='overflow-auto p-6 relative'>
            <img className='w-[50px] h-[50px] rounded-full float-left' src={require('../images/icon3.png')} alt='not found'/>
            <div className='float-left'>Username</div>
        </div>
    );
}

export default Profile;