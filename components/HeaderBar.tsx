import Dropdown, { Option } from 'react-dropdown'
import 'react-dropdown/style.css'

interface IProps {
    spreadString: string
    dropdownValues: Array<Option>
    dropdownValue: Option
    setDropdownValue: (value: Option) => void
    isMobile: boolean
}

const optionStyles = 'p-1.5'

export default function HeaderBar({
    spreadString,
    dropdownValues,
    dropdownValue,
    setDropdownValue,
    isMobile,
}: IProps) {
    return (
        <div className="flex flex-1 justify-between py-2 border-b border-gray-500">
            <span className="pl-8">Order Book</span>
            {!isMobile ? <span className="opacity-40">{spreadString}</span> : null}
            <span className="pr-8">
                <Dropdown
                    options={dropdownValues.map((option: Option) => {
                        return {
                            ...option,
                            className: optionStyles,
                        }
                    })}
                    value={dropdownValue}
                    onChange={(value) => setDropdownValue(value)}
                    className="text-xs relative w-24"
                    controlClassName="p-1 pr-6 bg-gray-400 rounded border-0 text-white"
                    arrowClassName="text-white border-dropdown-arrow -my-1"
                    menuClassName="text-xs text-white bg-gray-400 rounded-b -my-0.5"
                />
                <div className="-m" />
            </span>
        </div>
    )
}
