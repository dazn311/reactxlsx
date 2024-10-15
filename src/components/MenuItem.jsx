// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Link} from "react-router-dom";

// eslint-disable-next-line react/prop-types
function MenuItem({ title, address, Icon }) {
    return (
        <Link className='hover:text-amber-500' to={address}>
            <Icon className="text-2xl sm:hidden"/>
            <p className='uppercase hidden sm:inline text-sm'>{title}</p>
        </Link>
    );
}

export default MenuItem;