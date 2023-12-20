'use client'

import React from 'react';
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEtsy, faBehance } from '@fortawesome/free-brands-svg-icons';

const stdClass = 'mr-2 max-h-8';

const data = {
    'github': {
        'icon': <GitHubIcon className={stdClass}/>,
        'label': 'GitHub',
        'url': 'https://www.github.com/nateplusplus'
    },
    'linkedin': {
        'icon': <LinkedInIcon className={stdClass}/>,
        'label': 'LinkedIn',
        'url': 'https://www.linkedin.com/in/nateplusplus/'
    },
    'etsy': {
        'icon': <FontAwesomeIcon icon={faEtsy} className={`${stdClass} p-1 border border-blue-600 rounded`} />,
        'label': 'Etsy',
        'url': 'https://nateblairart.etsy.com'
    },
    'instagram': {
        'icon': <InstagramIcon className={stdClass}/>,
        'label': 'Instagram',
        'url': 'https://www.instagram.com/nateblairart/'
    },
    'behance': {
        'icon': <FontAwesomeIcon icon={faBehance} className={`${stdClass} p-1 border border-blue-600 rounded`} />,
        'label': 'Behance',
        'url': 'https://www.behance.net/nateplusplus'
    },
};

export default function Links({site}: {site: keyof typeof data}) {
    return (
    <Button
        component="a"
        href={site in data ? data[site].url: '#' }
        target="_blank"
    >
        {site in data && data[site].icon}
        {site in data && data[site].label}
    </Button>
    )
}
