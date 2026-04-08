// components/common/DynamicIconLazy.jsx
import React, { useState, useEffect } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

const iconCache = new Map();

const normalizePackageName = (packageName) => {
    const mapping = {
        'fa': 'fa',
        'fontawesome': 'fa',
        'fa6': 'fa6',
        'fontawesome6': 'fa6',
        'md': 'md',
        'material': 'md',
        'materialdesign': 'md',
        'io5': 'io5',
        'ionicons5': 'io5',
        'ionicons': 'io5',
        'hi2': 'hi2',
        'heroicons2': 'hi2',
        'hi': 'hi',
        'heroicons': 'hi',
        'fi': 'fi',
        'feather': 'fi',
        'lu': 'lu',
        'lucide': 'lu',
    };

    const normalized = mapping[packageName.toLowerCase()] || packageName;
    return normalized;
};

export const parseIconString = (iconString) => {
    if (!iconString) return { iconName: null, packageName: null, direct: false };

    let iconName = iconString.trim();
    let packageName = null;
    let direct = false;

    // Format 1: "Font Awesome/FaHeart" or "Font Awesome 6/FaHeart"
    if (iconString.includes('/')) {
        const [setName, icon] = iconString.split('/');
        iconName = icon.trim();

        // Map set name to package name
        const setToPackage = {
            'Font Awesome': 'fa',
            'Font Awesome 6': 'fa6',
            'Material Design': 'md',
            'Ionicons 5': 'io5',
            'Heroicons 2': 'hi2',
            'Heroicons': 'hi',
            'Feather': 'fi',
            'Lucide': 'lu',
            'Simple Icons': 'si',
            'Bootstrap': 'bs',
            'Ant Design': 'ai',
            'Remix Icon': 'ri',
            'Radix UI': 'rx',
            'Tabler Icons': 'tb',
            'Phosphor': 'pi',
            'Google Material': 'fc',
            'Grommet': 'gr',
            'Devicon': 'di',
            'Octicons': 'go',
            'VS Code': 'vsc',
            'Game Icons': 'gi',
            'Weather Icons': 'wi',
            'Themify': 'ti',
            'Circum': 'ci',
            'Linearicons': 'lia',
            'Bytesize': 'tfi',
            'Core UI': 'cg',
            'BoxIcons': 'bi',
            'IcoMoon': 'im',
            'Eva Icons': 'sl',
        };

        packageName = setToPackage[setName] || null;
        direct = true;
    }
    // Format 2: "FaHeart@Font Awesome"
    else if (iconString.includes('@')) {
        const [icon, setName] = iconString.split('@');
        iconName = icon.trim();

        const setToPackage = {
            'Font Awesome': 'fa',
            'Font Awesome 6': 'fa6',
            // ... same mapping as above
        };

        packageName = setToPackage[setName.trim()] || null;
        direct = true;
    }
    // Format 3: "fa:FaHeart" (legacy)
    else if (iconString.includes(':')) {
        const [pkg, icon] = iconString.split(':');
        packageName = normalizePackageName(pkg.trim());
        iconName = icon.trim();
        direct = true;
    }
    // Format 4: Direct icon name - we'll try to guess the package
    else {
        iconName = iconString.trim();
        direct = false;
    }

    return { iconName, packageName, direct };
};

export default function DynamicIconLazy({
    icon,
    className = "",
    size = "1em",
    color = "",
    fallback = <FaQuestionCircle className={className} style={{ fontSize: size, color }} />,
    ...props
}) {
    const [IconComponent, setIconComponent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!icon || typeof icon !== 'string') {
            setIconComponent(null);
            setError(null);
            return;
        }

        const { iconName, packageName, direct } = parseIconString(icon);

        if (!iconName) {
            setIconComponent(null);
            setError(null);
            return;
        }

        // Check cache first - use the full icon string as cache key
        if (iconCache.has(icon)) {
            setIconComponent(() => iconCache.get(icon));
            return;
        }

        const loadIcon = async () => {
            setLoading(true);
            setError(null);

            try {
                let foundPackage = packageName;
                let actualIconName = iconName;

                // If we don't have a direct package, try to guess from prefix
                if (!direct) {
                    const iconPackages = [
                        { prefix: 'Fa', package: 'fa6' }, // Try fa6 first for Fa prefix
                        { prefix: 'Fa6', package: 'fa6' },
                        { prefix: 'Md', package: 'md' },
                        { prefix: 'Io', package: 'io5' },
                        { prefix: 'Io5', package: 'io5' },
                        { prefix: 'IoMd', package: 'io' },
                        { prefix: 'Hi', package: 'hi2' },
                        { prefix: 'HiOutline', package: 'hi' },
                        { prefix: 'Si', package: 'si' },
                        { prefix: 'Ti', package: 'ti' },
                        { prefix: 'Go', package: 'go' },
                        { prefix: 'Fi', package: 'fi' },
                        { prefix: 'Gi', package: 'gi' },
                        { prefix: 'Wi', package: 'wi' },
                        { prefix: 'Di', package: 'di' },
                        { prefix: 'Ai', package: 'ai' },
                        { prefix: 'Bs', package: 'bs' },
                        { prefix: 'Ri', package: 'ri' },
                        { prefix: 'Fc', package: 'fc' },
                        { prefix: 'Gr', package: 'gr' },
                        { prefix: 'Im', package: 'im' },
                        { prefix: 'Bi', package: 'bi' },
                        { prefix: 'Cg', package: 'cg' },
                        { prefix: 'Vsc', package: 'vsc' },
                        { prefix: 'Tb', package: 'tb' },
                        { prefix: 'Tfi', package: 'tfi' },
                        { prefix: 'Rx', package: 'rx' },
                        { prefix: 'Pi', package: 'pi' },
                        { prefix: 'Lu', package: 'lu' },
                        { prefix: 'Ci', package: 'ci' },
                        { prefix: 'Lia', package: 'lia' },
                        { prefix: 'Sl', package: 'sl' },
                    ];

                    for (const { prefix, package: pkg } of iconPackages) {
                        if (iconName.startsWith(prefix)) {
                            foundPackage = pkg;
                            break;
                        }
                    }

                    if (!foundPackage && iconName.includes('fa-')) {
                        foundPackage = 'fa';
                        const parts = iconName.split(' ');
                        const iconClass = parts[parts.length - 1];
                        const iconNameWithoutFa = iconClass.replace('fa-', '');

                        actualIconName = 'Fa' + iconNameWithoutFa
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join('');
                    }

                    if (!foundPackage) {
                        throw new Error(`Unknown icon prefix for: ${iconName}`);
                    }
                }

                // Dynamic import based on package
                const pkgMap = {
                    fa: () => import('react-icons/fa'),
                    fa6: () => import('react-icons/fa6'),
                    fi: () => import('react-icons/fi'),
                    md: () => import('react-icons/md'),
                    hi: () => import('react-icons/hi'),
                    hi2: () => import('react-icons/hi2'),
                    io5: () => import('react-icons/io5'),
                    io: () => import('react-icons/io'),
                    lu: () => import('react-icons/lu'),
                    bi: () => import('react-icons/bi'),
                    ai: () => import('react-icons/ai'),
                    bs: () => import('react-icons/bs'),
                    ci: () => import('react-icons/ci'),
                    cg: () => import('react-icons/cg'),
                    di: () => import('react-icons/di'),
                    gi: () => import('react-icons/gi'),
                    gr: () => import('react-icons/gr'),
                    im: () => import('react-icons/im'),
                    pi: () => import('react-icons/pi'),
                    ri: () => import('react-icons/ri'),
                    rx: () => import('react-icons/rx'),
                    si: () => import('react-icons/si'),
                    sl: () => import('react-icons/sl'),
                    tb: () => import('react-icons/tb'),
                    tfi: () => import('react-icons/tfi'),
                    ti: () => import('react-icons/ti'),
                    vsc: () => import('react-icons/vsc'),
                    wi: () => import('react-icons/wi'),
                };
                const loader = pkgMap[foundPackage];
                if (!loader) throw new Error(`Unknown icon package: ${foundPackage}`);
                const importedModule = await loader();

                const possibleNames = [
                    actualIconName,
                    actualIconName.replace('Outline', ''),
                    actualIconName.replace('Solid', ''),
                    actualIconName.startsWith('Io') ? actualIconName.substring(2) : null,
                ].filter(Boolean);

                let Icon = null;
                for (const name of possibleNames) {
                    if (importedModule[name]) {
                        Icon = importedModule[name];
                        break;
                    }
                }

                if (!Icon) {
                    const iconEntries = Object.entries(importedModule);
                    for (const [key, value] of iconEntries) {
                        if (key.toLowerCase() === actualIconName.toLowerCase()) {
                            Icon = value;
                            break;
                        }
                    }
                }

                if (Icon) {
                    iconCache.set(icon, Icon);
                    setIconComponent(() => Icon);
                } else {
                    throw new Error(`Icon "${iconName}" not found in package "${foundPackage}"`);
                }
            } catch (err) {
                console.error('Failed to load icon:', err.message);
                setError(err.message);
                setIconComponent(null);
            } finally {
                setLoading(false);
            }
        };

        loadIcon();

        return () => {
            setIconComponent(null);
        };
    }, [icon]);

    if (loading) {
        return <FaQuestionCircle className={`${className} opacity-50`} style={{ fontSize: size, color }} {...props} />;
    }

    if (error) {
        console.warn(`Icon error for "${icon}":`, error);
    }

    if (IconComponent) {
        return <IconComponent className={className} style={{ fontSize: size, color }} {...props} />;
    }

    return fallback;
}

// Helper function to use with IconPicker
export function formatIconForPicker(iconString) {
    const { iconName, packageName } = parseIconString(iconString);
    if (!iconName) return '';

    // Map package name back to set name
    const packageToSet = {
        'fa': 'Font Awesome',
        'fa6': 'Font Awesome 6',
        'md': 'Material Design',
        'io5': 'Ionicons 5',
        'hi2': 'Heroicons 2',
        'hi': 'Heroicons',
        'fi': 'Feather',
        'lu': 'Lucide',
        'si': 'Simple Icons',
        'bs': 'Bootstrap',
        'ai': 'Ant Design',
        'ri': 'Remix Icon',
        'rx': 'Radix UI',
        'tb': 'Tabler Icons',
        'pi': 'Phosphor',
        'fc': 'Google Material',
        'gr': 'Grommet',
        'di': 'Devicon',
        'go': 'Octicons',
        'vsc': 'VS Code',
        'gi': 'Game Icons',
        'wi': 'Weather Icons',
        'ti': 'Themify',
        'ci': 'Circum',
        'lia': 'Linearicons',
        'tfi': 'Bytesize',
        'cg': 'Core UI',
        'bi': 'BoxIcons',
        'im': 'IcoMoon',
        'sl': 'Eva Icons',
    };

    const setName = packageToSet[packageName];
    return setName ? `${setName}/${iconName}` : iconName;
}