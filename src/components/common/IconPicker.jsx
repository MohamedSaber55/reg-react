// components/common/IconPicker.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';

/**
 * Icon packs are loaded on demand.
 *
 * This file previously did `import * as X from 'react-icons/<pack>'` for 30
 * packs. A namespace import cannot be tree-shaken, so all ~36 MB of icons were
 * pulled into the bundle - and because this component is reachable from the
 * statically imported dashboard, every public visitor downloaded it. Loading
 * each pack through a dynamic import keeps it out of the entry chunk and off
 * the critical path entirely.
 */
const ICON_PACK_LOADERS = {
    fa: () => import('react-icons/fa'),
    fa6: () => import('react-icons/fa6'),
    md: () => import('react-icons/md'),
    io5: () => import('react-icons/io5'),
    hi2: () => import('react-icons/hi2'),
    hi: () => import('react-icons/hi'),
    si: () => import('react-icons/si'),
    ti: () => import('react-icons/ti'),
    go: () => import('react-icons/go'),
    fi: () => import('react-icons/fi'),
    gi: () => import('react-icons/gi'),
    wi: () => import('react-icons/wi'),
    di: () => import('react-icons/di'),
    ai: () => import('react-icons/ai'),
    bs: () => import('react-icons/bs'),
    ri: () => import('react-icons/ri'),
    fc: () => import('react-icons/fc'),
    gr: () => import('react-icons/gr'),
    im: () => import('react-icons/im'),
    bi: () => import('react-icons/bi'),
    cg: () => import('react-icons/cg'),
    vsc: () => import('react-icons/vsc'),
    tb: () => import('react-icons/tb'),
    tfi: () => import('react-icons/tfi'),
    rx: () => import('react-icons/rx'),
    pi: () => import('react-icons/pi'),
    lu: () => import('react-icons/lu'),
    ci: () => import('react-icons/ci'),
    lia: () => import('react-icons/lia'),
    sl: () => import('react-icons/sl'),
};

/** Cache of in-flight/resolved pack modules, shared across every picker instance. */
const packCache = new Map();

const loadPack = (pkg) => {
    const loader = ICON_PACK_LOADERS[pkg];
    if (!loader) return Promise.resolve(null);
    if (!packCache.has(pkg)) {
        packCache.set(pkg, loader().catch(() => null));
    }
    return packCache.get(pkg);
};

// Metadata only - the icon components themselves arrive via loadPack.
const ICON_SETS = [
    { name: 'Font Awesome 6', prefix: 'Fa', color: '#528DD7', category: 'Popular', package: 'fa6' },
    { name: 'Font Awesome', prefix: 'Fa', color: '#528DD7', category: 'Popular', package: 'fa' },
    { name: 'Material Design', prefix: 'Md', color: '#FF5722', category: 'Popular', package: 'md' },
    { name: 'Heroicons 2', prefix: 'Hi', color: '#3B82F6', category: 'Popular', package: 'hi2' },
    { name: 'Heroicons', prefix: 'Hi', color: '#3B82F6', category: 'Popular', package: 'hi' },
    { name: 'Ionicons 5', prefix: 'Io', color: '#3880FF', category: 'Popular', package: 'io5' },
    { name: 'Feather', prefix: 'Fi', color: '#4A5568', category: 'Popular', package: 'fi' },
    { name: 'Lucide', prefix: 'Lu', color: '#3B82F6', category: 'Popular', package: 'lu' },
    { name: 'Simple Icons', prefix: 'Si', color: '#000000', category: 'Brands', package: 'si' },
    { name: 'Bootstrap', prefix: 'Bs', color: '#7952B3', category: 'UI Frameworks', package: 'bs' },
    { name: 'Ant Design', prefix: 'Ai', color: '#1890FF', category: 'UI Frameworks', package: 'ai' },
    { name: 'Remix Icon', prefix: 'Ri', color: '#25B864', category: 'UI Frameworks', package: 'ri' },
    { name: 'Radix UI', prefix: 'Rx', color: '#6B7280', category: 'UI Frameworks', package: 'rx' },
    { name: 'Tabler Icons', prefix: 'Tb', color: '#206BC4', category: 'UI Frameworks', package: 'tb' },
    { name: 'Phosphor', prefix: 'Pi', color: '#60A5FA', category: 'UI Frameworks', package: 'pi' },
    { name: 'Google Material', prefix: 'Fc', color: '#4285F4', category: 'Google', package: 'fc' },
    { name: 'Grommet', prefix: 'Gr', color: '#7D4CDB', category: 'UI Frameworks', package: 'gr' },
    { name: 'Devicon', prefix: 'Di', color: '#333333', category: 'Development', package: 'di' },
    { name: 'Octicons', prefix: 'Go', color: '#24292E', category: 'Development', package: 'go' },
    { name: 'VS Code', prefix: 'Vsc', color: '#007ACC', category: 'Development', package: 'vsc' },
    { name: 'Game Icons', prefix: 'Gi', color: '#FF6B6B', category: 'Games', package: 'gi' },
    { name: 'Weather Icons', prefix: 'Wi', color: '#4A90E2', category: 'Weather', package: 'wi' },
    { name: 'Themify', prefix: 'Ti', color: '#FF4081', category: 'UI', package: 'ti' },
    { name: 'Circum', prefix: 'Ci', color: '#6B7280', category: 'UI', package: 'ci' },
    { name: 'Linearicons', prefix: 'Lia', color: '#3B82F6', category: 'UI', package: 'lia' },
    { name: 'Bytesize', prefix: 'Tfi', color: '#4A5568', category: 'UI', package: 'tfi' },
    { name: 'Core UI', prefix: 'Cg', color: '#6B7280', category: 'UI', package: 'cg' },
    { name: 'BoxIcons', prefix: 'Bi', color: '#3B82F6', category: 'UI', package: 'bi' },
    { name: 'IcoMoon', prefix: 'Im', color: '#8257E5', category: 'UI', package: 'im' },
    { name: 'Eva Icons', prefix: 'Sl', color: '#7C3AED', category: 'UI', package: 'sl' },
];

const CATEGORIES = [
    'All',
    'Popular',
    'UI Frameworks',
    'Brands',
    'Development',
    'Games',
    'Weather',
    'Google',
    'UI'
];

export default function IconPicker({ value, onChange, error, label, helperText }) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSet, setSelectedSet] = useState('All');
    // Defaults to Popular rather than All: "All" means fetching every pack,
    // which is tens of megabytes over the network.
    const [selectedCategory, setSelectedCategory] = useState('Popular');
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [page, setPage] = useState(1);
    const [loadedPacks, setLoadedPacks] = useState({});
    const [isLoadingPacks, setIsLoadingPacks] = useState(false);
    const [previewIcon, setPreviewIcon] = useState(null);
    const itemsPerPage = 200;
    const searchInputRef = useRef(null);

    // Focus search input when modal opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Packs the current filter needs.
    const requiredPackages = useMemo(
        () =>
            ICON_SETS.filter(
                (set) =>
                    (selectedCategory === 'All' || set.category === selectedCategory) &&
                    (selectedSet === 'All' || set.name === selectedSet)
            ).map((set) => set.package),
        [selectedCategory, selectedSet]
    );

    const requiredKey = requiredPackages.join(',');

    // Fetch whatever the current filter needs, once the modal is actually open.
    useEffect(() => {
        if (!isOpen) return undefined;

        let cancelled = false;
        const pending = requiredPackages.filter((pkg) => !loadedPacks[pkg]);
        if (pending.length === 0) return undefined;

        setIsLoadingPacks(true);

        Promise.all(pending.map(async (pkg) => [pkg, await loadPack(pkg)]))
            .then((entries) => {
                if (cancelled) return;
                setLoadedPacks((prev) => {
                    const next = { ...prev };
                    entries.forEach(([pkg, mod]) => {
                        if (mod) next[pkg] = mod;
                    });
                    return next;
                });
            })
            .finally(() => {
                if (!cancelled) setIsLoadingPacks(false);
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, requiredKey]);

    // Resolve the currently selected value to a component for the preview button.
    useEffect(() => {
        let cancelled = false;

        if (!value) {
            setPreviewIcon(null);
            return undefined;
        }

        const resolve = async () => {
            if (value.includes('/')) {
                const [setName, iconName] = value.split('/');
                const set = ICON_SETS.find((s) => s.name === setName);
                if (set) {
                    const mod = await loadPack(set.package);
                    if (cancelled) return;
                    if (mod?.[iconName]) {
                        setPreviewIcon({ component: mod[iconName], setName, iconName });
                        return;
                    }
                }
            }

            // Bare icon name - only scan the popular packs so a lookup can't
            // pull every library over the network.
            for (const set of ICON_SETS.filter((s) => s.category === 'Popular')) {
                const mod = await loadPack(set.package);
                if (cancelled) return;
                if (mod?.[value]) {
                    setPreviewIcon({ component: mod[value], setName: set.name, iconName: value });
                    return;
                }
            }

            if (!cancelled) setPreviewIcon({ component: null, setName: '', iconName: value });
        };

        resolve();
        return () => {
            cancelled = true;
        };
    }, [value]);

    // Filter icons across the packs that have loaded.
    const filteredIcons = useMemo(() => {
        const allIcons = [];

        ICON_SETS.forEach(set => {
            if (selectedCategory !== 'All' && set.category !== selectedCategory) {
                return;
            }
            if (selectedSet !== 'All' && set.name !== selectedSet) {
                return;
            }

            const mod = loadedPacks[set.package];
            if (!mod) return;

            Object.entries(mod).forEach(([name, IconComponent]) => {
                if (typeof IconComponent !== 'function') return;

                const displayName = name.replace(set.prefix, '').replace(/([A-Z])/g, ' $1').trim();
                const searchLower = searchTerm.toLowerCase();

                if (
                    searchTerm === '' ||
                    name.toLowerCase().includes(searchLower) ||
                    displayName.toLowerCase().includes(searchLower)
                ) {
                    allIcons.push({
                        name,
                        component: IconComponent,
                        displayName,
                        setName: set.name,
                        prefix: set.prefix,
                        color: set.color,
                        category: set.category,
                        package: set.package
                    });
                }
            });
        });

        if (searchTerm) {
            allIcons.sort((a, b) => {
                const aStartsWith = a.name.toLowerCase().startsWith(searchTerm.toLowerCase());
                const bStartsWith = b.name.toLowerCase().startsWith(searchTerm.toLowerCase());
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.displayName.localeCompare(b.displayName);
            });
        }

        return allIcons;
    }, [searchTerm, selectedSet, selectedCategory, loadedPacks]);

    // Paginate icons
    const paginatedIcons = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        return filteredIcons.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredIcons, page]);

    const totalPages = Math.ceil(filteredIcons.length / itemsPerPage);

    const handleIconSelect = (icon) => {
        const formattedValue = `${icon.setName}/${icon.name}`;
        onChange(formattedValue);
        setIsOpen(false);
        setPage(1);
        setSearchTerm('');
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedSet('All');
        setSelectedCategory('Popular');
        setPage(1);
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-third-900">
                    {label}
                </label>
            )}

            {/* Icon Preview and Input */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className={`
                        flex items-center gap-2 px-3 py-2 border rounded-lg 
                        ${error ? 'border-error' : 'border-neutral-400  '}
                        hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                        bg-white  
                        transition-colors duration-200 shrink-0
                    `}
                >
                    {previewIcon?.component ? (
                        <>
                            <previewIcon.component className="h-5 w-5" />
                            <span className="text-sm text-third-900   max-w-37.5 truncate">
                                {previewIcon.iconName}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm text-third-500">
                            {t('dashboard.forms.selectIcon')}
                        </span>
                    )}
                </button>

                {/* Input for manual entry or display */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Font Awesome/FaHeart or FaHeart"
                        className={`
                            w-full px-3 py-2 border rounded-lg
                            ${error ? 'border-error' : 'border-neutral-400  '}
                            focus:outline-none focus:ring-2 focus:ring-primary/20
                            bg-white   text-third-900  
                        `}
                    />
                    {previewIcon?.setName && (
                        <div className="absolute inset-e-2 top-1/2 transform -translate-y-1/2">
                            <span className="text-xs px-2 py-1 rounded-full bg-neutral-100   text-third-500">
                                {previewIcon.setName}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Icon Picker Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white   rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-neutral-400">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {t('dashboard.forms.selectIcon')}
                                    </h3>
                                    <p className="text-sm text-third-500">
                                        {filteredIcons.length.toLocaleString()} icons available
                                        {value && (
                                            <span className="ms-2">
                                                • Selected: <code className="bg-neutral-100   px-2 py-1 rounded">
                                                    {value}
                                                </code>
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-neutral-100   rounded-full"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute inset-s-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-third-500" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder={t('dashboard.forms.searchIcons')}
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full ps-10 pe-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-e-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-neutral-100   rounded-full"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-2">
                                {/* Category Filter */}
                                <div className="flex flex-wrap gap-1">
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setPage(1);
                                            }}
                                            className={`
                                                px-3 py-1 rounded-full text-sm whitespace-nowrap
                                                ${selectedCategory === category
                                                    ? 'bg-primary text-white'
                                                    : 'bg-neutral-100   text-third-900  '
                                                }
                                            `}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>

                                {/* Icon Set Filter */}
                                <select
                                    value={selectedSet}
                                    onChange={(e) => {
                                        setSelectedSet(e.target.value);
                                        setPage(1);
                                    }}
                                    className="px-3 py-1 rounded-lg border bg-white   text-third-900"
                                >
                                    <option value="All">All Icon Sets</option>
                                    {ICON_SETS.map((set) => (
                                        <option key={set.name} value={set.name}>
                                            {set.name}
                                        </option>
                                    ))}
                                </select>

                                {/* View Mode Toggle */}
                                <div className="flex ms-auto gap-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-neutral-200  ' : 'hover:bg-neutral-100  '}`}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-neutral-200  ' : 'hover:bg-neutral-100  '}`}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Icons Display */}
                        <div className="flex-1 overflow-auto p-4">
                            {isLoadingPacks && paginatedIcons.length === 0 ? (
                                <div className="text-center py-12 text-third-500">
                                    Loading icon sets...
                                </div>
                            ) : paginatedIcons.length > 0 ? (
                                <>
                                    {/* Grid View */}
                                    {viewMode === 'grid' ? (
                                        <div className="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                                            {paginatedIcons.map((icon) => (
                                                <button
                                                    key={`${icon.setName}-${icon.name}`}
                                                    onClick={() => handleIconSelect(icon)}
                                                    className={`
                                                        flex flex-col items-center justify-center p-2 rounded-lg 
                                                        hover:bg-neutral-100   
                                                        ${value === `${icon.setName}/${icon.name}` ? 'bg-primary/10 border border-primary' : ''}
                                                        transition-colors duration-200 group relative
                                                    `}
                                                    title={`${icon.displayName} (${icon.setName})`}
                                                >
                                                    <div
                                                        className="h-6 w-6 mb-1 flex items-center justify-center"
                                                        style={{ color: icon.color }}
                                                    >
                                                        <icon.component className="h-full w-full" />
                                                    </div>
                                                    <span className="text-xs text-center text-third-500   truncate w-full">
                                                        {icon.displayName}
                                                    </span>
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="absolute -top-8 inset-s-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                                            {icon.setName}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        /* List View */
                                        <div className="space-y-1">
                                            {paginatedIcons.map((icon) => (
                                                <button
                                                    key={`${icon.setName}-${icon.name}`}
                                                    onClick={() => handleIconSelect(icon)}
                                                    className={`
                                                        flex items-center gap-3 p-3 rounded-lg w-full
                                                        hover:bg-neutral-100   
                                                        ${value === `${icon.setName}/${icon.name}` ? 'bg-primary/10 border border-primary' : ''}
                                                        transition-colors duration-200
                                                    `}
                                                >
                                                    <div
                                                        className="h-5 w-5 shrink-0"
                                                        style={{ color: icon.color }}
                                                    >
                                                        <icon.component className="h-full w-full" />
                                                    </div>
                                                    <div className="flex-1 text-start">
                                                        <div className="font-medium">{icon.displayName}</div>
                                                        <div className="text-xs text-third-500">
                                                            {icon.name}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-neutral-200">
                                                        {icon.setName}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-400">
                                            <button
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100   disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </button>
                                            <div className="text-sm text-third-500">
                                                Page {page} of {totalPages}
                                                <span className="mx-2">•</span>
                                                {((page - 1) * itemsPerPage + 1).toLocaleString()} - {Math.min(page * itemsPerPage, filteredIcons.length).toLocaleString()} of {filteredIcons.length.toLocaleString()} icons
                                            </div>
                                            <button
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                disabled={page === totalPages}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100   disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="mx-auto w-12 h-12 bg-neutral-100   rounded-full flex items-center justify-center mb-4">
                                        <Search className="h-6 w-6 text-third-500" />
                                    </div>
                                    <h4 className="text-lg font-medium mb-2">
                                        {t('dashboard.forms.noIconsFound')}
                                    </h4>
                                    <p className="text-third-500   mb-4">
                                        Try different keywords or filters
                                    </p>
                                    <button
                                        onClick={resetFilters}
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-neutral-400">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="text-sm text-third-500">
                                    <p>
                                        <strong>Tip:</strong> The icon picker returns icons in the format "Set Name/IconName"
                                    </p>
                                    <p className="mt-1">
                                        This format is automatically parsed by DynamicIconLazy
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            onChange('');
                                            setIsOpen(false);
                                        }}
                                        className="px-4 py-2 border border-neutral-400   rounded-lg hover:bg-neutral-100"
                                    >
                                        Clear Icon
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 bg-neutral-100   rounded-lg hover:bg-neutral-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {helperText && !error && (
                <p className="text-xs text-third-500">
                    {helperText}
                </p>
            )}
            {error && (
                <p className="text-xs text-error">{error}</p>
            )}
        </div>
    );
}