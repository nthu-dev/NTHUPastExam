"use client"
import {Bars4Icon, ClockIcon, HomeIcon} from "@heroicons/react/24/outline";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
export default function MobileSideBar() {
    const navigation = [
        {name: 'Home', href: '#', icon: HomeIcon, current: true},
        {name: 'My tasks', href: '#', icon: Bars4Icon, current: false},
        {name: 'Recent', href: '#', icon: ClockIcon, current: false},
    ]
    return (
        <>
            {navigation.map((item) => (
                <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                        item.current
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center rounded-md px-2 py-2 text-base font-medium leading-5'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                >
                    <item.icon
                        className={classNames(
                            item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                            'mr-3 h-6 w-6 flex-shrink-0'
                        )}
                        aria-hidden="true"
                    />
                    {item.name}
                </a>
            ))}
        </>
    )
}