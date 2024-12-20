import Title from "./Title";
import Logo from "./Logo";

function Header(props){
    return(
        <div class='header' className='w-[100%] overflow-auto p-6'>
            <div class='container' className='float-left'>
                <Title>{props.title}</Title>
            </div>
            <div class='container' className='float-right'>
                <Logo></Logo>
            </div>
        </div>
    );
}

export default Header;