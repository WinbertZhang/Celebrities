import Title from "./Title";
import Logo from "./Logo";

function Profile(props){
    return(
        <div className='overflow-auto p-6 relative'>
            <img className='w-[50px] h-[50px] rounded-full float-left' src={require('../images/icon3.png')} alt='not found'/>
            <h className='float-left'>Username</h>
        </div>
    );
}

export default Profile;