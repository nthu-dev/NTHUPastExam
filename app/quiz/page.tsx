import {PlusIcon} from '@heroicons/react/20/solid'
import {PaperClipIcon} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function MainPage() {
    return (
        <div className="text-center mt-8">
            <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400"/>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">還沒有考古題</h3>
            <p className="mt-1 text-sm text-gray-500">從側邊欄挑選考古題或者建立考古題</p>
            <div className="mt-6">
                <Link
                    href={'/quiz/new'}
                    type="button"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true"/>
                    新增考古題
                </Link>
            </div>
        </div>
    )
}