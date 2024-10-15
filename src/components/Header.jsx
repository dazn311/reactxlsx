import {Link} from "react-router-dom";
import MenuItem from "./MenuItem.jsx";
import {AiFillHome} from "react-icons/ai";
import {BsFillInfoCircleFill} from "react-icons/bs";
import {FaFileExcel} from "react-icons/fa";

const DEFAULT_PAGE = import.meta.env.DEFAULT_PAGE;

function Header() {
    return (
        <div className='flex justify-between items-center p-3 max-w-6xl mx-auto print:hidden'>
            <div className='flex gap-4'>
                <MenuItem title='home' address={`/?category=${DEFAULT_PAGE}`} Icon={AiFillHome} />
                <MenuItem title='about' address='/about' Icon={BsFillInfoCircleFill} />
                <MenuItem title='Xls' address='/xlsx' Icon={FaFileExcel} />
            </div>
            <div className='flex items-center gap-4'>
                <Link href={'/'} className='flex gap-1 items-center'>
                    <span className='text-2xl font-bold bg-amber-500 py-1 px-2 rounded-lg'>
                      Ali
                    </span>
                    <span className='text-xl hidden sm:inline'>Extends</span>
                </Link>
            </div>
        </div>
    );
}

export default Header;