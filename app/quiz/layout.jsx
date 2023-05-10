"use client"
import {Fragment, useEffect, useRef, useState} from 'react'
import {Dialog, Menu, Transition} from '@headlessui/react'
import {Bars3CenterLeftIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {
    ChevronUpDownIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import DesktopSideBar from "./SideBarList/Desktop";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import {usePathname} from "next/navigation";
import Link from "next/link";
import SideBarTags from "./SideBarTags/SideBarTags";
import Image from "next/image";

const teams = [
    {name: 'Engineering', href: '#', bgColorClass: 'bg-indigo-500'},
    {name: 'Human Resources', href: '#', bgColorClass: 'bg-green-500'},
    {name: 'Customer Success', href: '#', bgColorClass: 'bg-yellow-500'},
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example({children}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [user, setUser] = useState(null)
    const isFirst = useRef(true);
    const pathname = usePathname()

    useEffect(() => {
        (async () => {
            if (!isFirst.current) return
            isFirst.current = false
            if (window?.localStorage && localStorage.getItem('token') === null) return setUser(null)
            try {
                const data = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/user', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(r => {
                    if (!r.ok) throw new Error('Not authorized')
                    return r.json()
                })
                setUser(data)
            } catch (e) {
                console.log(e)
                setUser(null)
                localStorage.removeItem('token')
            }
        })()
    })

    const login = async (jwt) => {
        try {
            const data = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({token: jwt})
            }).then(r => r.json())
            localStorage.setItem('token', data.token)
            setUser(data.user)
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <GoogleOAuthProvider clientId="378522369727-b0q3e2r2vpdrc53luoc7pu68f8i0vq59.apps.googleusercontent.com">
            <div className="min-h-full">
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-75"/>
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel
                                    className="relative flex w-full max-w-xs flex-1 flex-col bg-white pb-4 pt-5">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute right-0 top-0 -mr-12 pt-2">
                                            <button
                                                type="button"
                                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="flex flex-shrink-0 items-center px-4">
                                        <img
                                            className="h-8 w-auto"
                                            src="/logo.jpg"
                                            alt="My Logo"
                                        />
                                    </div>
                                    <div className="mt-5 h-0 flex-1 overflow-y-auto">
                                        <nav className="px-2">
                                            <div className="space-y-1">
                                                <DesktopSideBar/>
                                            </div>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                            <div className="w-14 flex-shrink-0" aria-hidden="true">
                                {/* Dummy element to force sidebar to shrink to fit close icon */}
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div
                    className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-100 lg:pb-4 lg:pt-5">
                    <div className="flex flex-shrink-0 items-center px-6">
                        <Image
                            className="h-16 w-auto rounded-full"
                            src="/logo.jpg"
                            width={1280}
                            height={1280}
                            alt="Your Company"
                        />
                    </div>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="mt-5 flex h-0 flex-1 flex-col overflow-y-auto pt-1">
                        {/* User account dropdown */}
                        {(typeof localStorage !== "undefined" && !localStorage.getItem('token')) ?
                            <div className={"w-full flex justify-center"}>
                                <GoogleLogin
                                    onSuccess={credentialResponse => {
                                        login(credentialResponse.credential);
                                    }}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                    hosted_domain={"gapp.nthu.edu.tw"}
                                    auto_select
                                    useOneTap
                                />
                            </div>
                            :
                            <Menu as="div" className="relative inline-block px-3 text-left">
                                <div>
                                    <Menu.Button
                                        className="group w-full rounded-md bg-gray-100 px-3.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                      <span className="flex w-full items-center justify-between">
                                        <span className="flex min-w-0 items-center justify-between space-x-3">
                                          <img
                                              className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                                              src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
                                              alt=""
                                          />
                                          <span className="flex min-w-0 flex-1 flex-col">
                                            <span
                                                className="truncate text-sm font-medium text-gray-900">{user?.name}</span>
                                            <span className="truncate text-sm text-gray-500">@username</span>
                                          </span>
                                        </span>
                                        <ChevronUpDownIcon
                                            className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                      </span>
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items
                                        className="absolute left-0 right-0 z-10 mx-3 mt-1 origin-top divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({active}) => (
                                                    <a
                                                        href="#"
                                                        className={classNames(
                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                    >
                                                        設定
                                                    </a>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({active}) => (
                                                    <a
                                                        href="#"
                                                        className={classNames(
                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                    >
                                                        通知
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        </div>
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({active}) => (
                                                    <a
                                                        href="#"
                                                        className={classNames(
                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                    >
                                                        登出
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        }
                        {/* Sidebar Search */}
                        <div className="mt-5 px-3">
                            <label htmlFor="search" className="sr-only">
                                Search
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div
                                    className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                                    aria-hidden="true"
                                >
                                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true"/>
                                </div>
                                <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    className="block w-full rounded-md border-0 py-1.5 pl-9 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Search"
                                />
                            </div>
                        </div>
                        <nav className="mt-6 px-3">
                            <div className="space-y-1">
                                <DesktopSideBar/>
                            </div>
                            <div className="mt-8">
                                {/* Secondary navigation */}
                                <SideBarTags/>
                            </div>
                        </nav>
                    </div>
                </div>
                {/* Main column */}
                <div className="flex flex-col lg:pl-64">
                    {/* Search header */}
                    <div
                        className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:hidden">
                        <button
                            type="button"
                            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true"/>
                        </button>
                        <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-1">
                                <form className="flex w-full md:ml-0" action="#" method="GET">
                                    <label htmlFor="search-field" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                        <div
                                            className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                                            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true"/>
                                        </div>
                                        <input
                                            id="search-field"
                                            name="search-field"
                                            className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-0 focus:placeholder:text-gray-400 sm:text-sm"
                                            placeholder="Search"
                                            type="search"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="flex items-center">
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button
                                            className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                                            <span className="sr-only">Open user menu</span>
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items
                                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            View profile
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            Settings
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            Notifications
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            Get desktop app
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            Support
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({active}) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            Logout
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <main className="flex-1">
                        {/* Page title & actions */}
                        <div
                            className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                            <div className="min-w-0 flex-1">
                                <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">清大考古題系統</h1>
                            </div>
                            <div className="mt-4 flex sm:ml-4 sm:mt-0">
                                <button
                                    type="button"
                                    className="sm:order-0 order-1 ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-0"
                                >
                                    Share
                                </button>
                                <Link
                                    href={'/quiz/new'}
                                    type="button"
                                    className="order-0 inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 sm:order-1 sm:ml-3"
                                >
                                    建立考古
                                </Link>
                            </div>
                        </div>
                        {children}
                    </main>
                </div>
            </div>
        </GoogleOAuthProvider>
    )
}
