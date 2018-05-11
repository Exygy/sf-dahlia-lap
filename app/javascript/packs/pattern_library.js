import WebpackerReact from 'webpacker-react'
import Turbolinks from 'turbolinks'

// All imports from Pattern Library
import BreadCrumbs from 'components/atoms/BreadCrumbs'
import Button from 'components/atoms/Button'
import DropdownMenuItem from 'components/atoms/DropdownMenuItem'
import DropdownMenuItemCheckbox from 'components/atoms/DropdownMenuItemCheckbox'
import Icon from 'components/atoms/Icon'
import FormGroupTextInput from 'components/atoms/FormGroupTextInput'
import FormGroupTextArea from 'components/atoms/FormGroupTextArea'
import FormGroupTextValue from 'components/atoms/FormGroupTextValue'
import FormGroupRadioGroup from 'components/atoms/FormGroupRadioGroup'
import FormGroupCheckboxGroup from 'components/atoms/FormGroupCheckboxGroup'
import AlertBox from 'components/molecules/AlertBox'
import AlertNotice from 'components/molecules/AlertNotice'
import DropdownMenu from 'components/molecules/DropdownMenu'
import DropdownMenuMultiSelect from 'components/molecules/DropdownMenuMultiSelect'
import Dropdown from 'components/molecules/Dropdown'
import FormGridRow from 'components/molecules/FormGridRow'
import TabsMenu from 'components/molecules/TabsMenu'
import TablePagination from 'components/molecules/TablePagination'
import ContentSection from 'components/organisms/ContentSection'
import Modal from 'components/organisms/Modal'
import PageHeader from 'components/organisms/PageHeader'
import PageHeaderSimple from 'components/organisms/PageHeaderSimple'
import TabsSection from 'components/organisms/TabsSection'
import TabCard from 'components/organisms/TabCard'

Turbolinks.start()

// All setup components after this
WebpackerReact.setup({ Button })
WebpackerReact.setup({ DropdownMenuItem })
WebpackerReact.setup({ DropdownMenuItemCheckbox })
WebpackerReact.setup({ Icon })
WebpackerReact.setup({ FormGroupTextInput })
WebpackerReact.setup({ FormGroupTextArea })
WebpackerReact.setup({ FormGroupTextValue })
WebpackerReact.setup({ FormGroupRadioGroup })
WebpackerReact.setup({ FormGroupCheckboxGroup })
WebpackerReact.setup({ BreadCrumbs })
WebpackerReact.setup({ AlertBox })
WebpackerReact.setup({ AlertNotice })
WebpackerReact.setup({ DropdownMenu })
WebpackerReact.setup({ DropdownMenuMultiSelect })
WebpackerReact.setup({ Dropdown })
WebpackerReact.setup({ FormGridRow })
WebpackerReact.setup({ TabsMenu })
WebpackerReact.setup({ TablePagination })
WebpackerReact.setup({ ContentSection })
WebpackerReact.setup({ Modal })
WebpackerReact.setup({ PageHeader })

WebpackerReact.setup({ PageHeaderSimple })
WebpackerReact.setup({ TabsSection })
WebpackerReact.setup({ TabCard })