import { useEffect, useState } from "react";
import { goTo } from "react-chrome-extension-router";
import { Space, Tooltip, Typography } from "antd";
import { DownOutlined, EnterOutlined, UpOutlined, BulbOutlined, BulbFilled } from "@ant-design/icons/lib/icons";
import CommandPalette, { filterItems, getItemIndex } from "@tmikeladze/react-cmdk";
import { MdChecklist, MdEmojiPeople, MdOutlineAdb } from 'react-icons/md';
import { createFromIconfontCN } from '@ant-design/icons';
import Tabs from './SideItemMenuRouting';
import '@tmikeladze/react-cmdk/dist/cmdk.css';
import { BiMobileVibration } from "react-icons/bi";
import { BsBrowserChrome, BsMailbox2, BsTools } from "react-icons/bs";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import { AiOutlineGithub } from "react-icons/ai";
import ReverseShell from './system/linux/ReverseShell';
import ADB from "./mobile/Android/ADB";
import CustomPayloadTable from "./misc/PrivateCheatSheet";

const { Text } = Typography;

const CommandNavigation = ( { darkMode, setDarkMode } ) => {
    const [ page, setPage ] = useState<"root" | "Web" | "System" | "Mobile" | "Tools">( "root" );
    const [ isOpen, setIsOpen ] = useState<boolean>( false );
    const [ search, setSearch ] = useState( "" );
    const isMac = navigator.platform.toUpperCase().includes( 'MAC' );
    const keyToCheck = isMac ? 'Meta' : 'Control';
    const keySymbol = isMac ? '⌘' : 'CRTL';

    const IconFont = createFromIconfontCN( {
        scriptUrl: [ './iconfont.js' ]
    } );

    useEffect( () => {
        function handleKeyDown ( e: KeyboardEvent ) {

            if ( e.key === 'k' && e.getModifierState( keyToCheck ) ) {
                e.preventDefault();
                e.stopPropagation();

                setIsOpen( ( currentValue ) => {
                    return !currentValue;
                } );
            }

            if ( e.key === 'l' && e.getModifierState( keyToCheck ) ) {
                e.preventDefault();
                e.stopPropagation();

                setDarkMode( !darkMode );
            }
        }

        document.addEventListener( "keydown", handleKeyDown );

        return () => {
            document.removeEventListener( "keydown", handleKeyDown );
        };
    }, [ darkMode ] );


    useEffect( () => {
        if ( isOpen ) {
            setPage( "root" );
        }
    }, [ isOpen ] );

    function groupBy ( array, key ) {
        return array.reduce( ( result, currentItem ) => {
            ( result[ currentItem[ key ] ] = result[ currentItem[ key ] ] || [] ).push( currentItem );
            return result;
        }, {} );
    }

    const groupedTabs = groupBy( Tabs, 'type' );

    const filteredItems = Object.keys( groupedTabs ).map( type => ( {
        heading: type.charAt( 0 ).toUpperCase() + type.slice( 1 ) + ' Security',
        id: type,
        items: groupedTabs[ type ].map( tab => ( {
            id: tab.key,
            children: tab.name,
            name: tab.name,
            href: tab.componentRoute,
            heroIcon: tab.icon,
        } ) ),
    } ) );

    const rootItemsMenu = filterItems(
        [
            {
                heading: "Suggestions",
                id: "suggestions",
                items: [
                    {
                        id: "reverse_shell",
                        children: "Reverse Shell",
                        icon: ( <IconFont type='icon-gnubash' style={{ fontSize: '1.3em', marginTop: 3 }} /> ),
                        closeOnSelect: false,
                        onClick: () => {
                            goTo( ReverseShell );
                            setIsOpen( false );
                        },
                    },
                    {
                        id: "adb_commands",
                        children: "ADB Commands",
                        icon: ( <MdOutlineAdb style={{ fontSize: '1.3em', marginTop: 3 }} /> ),
                        closeOnSelect: false,
                        onClick: () => {
                            goTo( ADB );
                            setIsOpen( false );
                        },
                    },
                    {
                        id: "cheat_sheet",
                        children: "Private Cheat Sheet",
                        icon: ( <MdChecklist style={{ fontSize: '1.3em', marginTop: 3 }} /> ),
                        closeOnSelect: false,
                        onClick: () => {
                            goTo( CustomPayloadTable );
                            setIsOpen( false );
                        },
                    },
                ],
            },
            {
                heading: "Navigation",
                id: "navigation",
                items: [
                    {
                        id: "Web",
                        children: "Web",
                        icon: ( <BsBrowserChrome style={{ fontSize: '1.3em', marginTop: 3 }} /> ),
                        closeOnSelect: false,
                        onClick: () => {
                            setPage( "Web" );
                        },
                    },
                    {
                        id: "System",
                        children: "System",
                        icon: ( <HiOutlineDesktopComputer style={{ fontSize: '1.3em', marginTop: 3 }} /> ),
                        closeOnSelect: false,
                        onClick: () => {
                            setPage( "System" );
                        },
                    },
                    {
                        id: "Mobile",
                        children: "Mobile",
                        icon: ( <BiMobileVibration style={{ fontSize: '1.3em', marginTop: 3 }} /> ),
                        closeOnSelect: false,
                        onClick: () => {
                            setPage( "Mobile" );
                        },
                    },
                    {
                        id: "Tools",
                        children: "Tools",
                        icon: ( <BsTools style={{ fontSize: '1.3em', marginTop: 3 }} /> ),
                        closeOnSelect: false,
                        onClick: () => {
                            setPage( "Tools" );
                        },
                    },
                ],
            },
            {
                heading: "Contact",
                id: "contact",
                items: [
                    {
                        id: "mail",
                        children: "Mail Us",
                        icon: ( <BsMailbox2 style={{ fontSize: '1.3em', marginTop: 3 }} /> ),
                        closeOnSelect: false,
                        onClick: () => {
                            window.open( 'mailto:contact@hacktools.com', '_blank' ).focus();
                            setIsOpen( false );
                        },
                    },
                    {
                        id: "suggestions",
                        children: "Suggestions",
                        icon: ( <MdEmojiPeople style={{ fontSize: '1.3em', marginTop: 3 }} /> ),
                        closeOnSelect: false,
                        onClick: () => {
                            window.open( 'https://github.com/LasCC/Hack-Tools/issues', '_blank' ).focus();
                            setIsOpen( false );
                        },
                    },
                    {
                        id: "bug_report",
                        children: "Bug Report",
                        icon: ( <AiOutlineGithub style={{ fontSize: '1.3em', marginTop: 3 }} /> ),
                        closeOnSelect: false,
                        onClick: () => {
                            window.open( 'https://github.com/LasCC/Hack-Tools/issues', '_blank' ).focus();
                            setIsOpen( false );
                        },
                    },
                ],
            },
        ],
        search
    );

    return (
        <CommandPalette
            commandPaletteContentClassName={darkMode ? 'dark' : 'light'}
            onChangeSearch={setSearch}
            onChangeOpen={setIsOpen}
            search={search}
            isOpen={isOpen}
            page={page}
            footer={
                <Space style={{ padding: 13, display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Text>
                            <Space>
                                <Text keyboard><EnterOutlined /></Text> to select
                                <Text keyboard><UpOutlined /><DownOutlined /></Text> to navigate
                                <Text keyboard>Esc</Text> to close
                            </Space>
                        </Text>
                    </div>
                    <Tooltip title={`Toggle Dark Mode (${ keySymbol } + L)`}>
                        <Text keyboard>
                            {darkMode ? <BulbFilled style={{ color: '#fadb14' }} /> : <BulbOutlined />}
                        </Text>
                    </Tooltip>
                </Space>
            }
        >
            <CommandPalette.Page id="root">
                {rootItemsMenu.length ? (
                    rootItemsMenu.map( ( list ) => (
                        <CommandPalette.List key={list.id} heading={list.heading}>
                            {list.items.map( ( { id, icon, ...rest } ) => (
                                <CommandPalette.ListItem
                                    key={id}
                                    index={getItemIndex( rootItemsMenu, id )}
                                    {...rest}
                                >
                                    <div className='flex items-center w-full'>
                                        <Text style={{ marginRight: 5 }}>{icon}</Text>
                                        <Text>{rest.children}</Text>
                                    </div>
                                </CommandPalette.ListItem>
                            ) )}
                        </CommandPalette.List>
                    ) )
                ) : (
                    <CommandPalette.FreeSearchAction />
                )}
            </CommandPalette.Page>
            <CommandPalette.Page id="Web">
                {filteredItems.length ? (
                    filteredItems
                        .filter( list => list.id === "web" )
                        .map( ( list ) => (
                            <CommandPalette.List key={list.id} heading={list.heading}>
                                {list.items.map( ( { id, heroIcon, name, ...rest } ) => (
                                    <CommandPalette.ListItem
                                        key={id}
                                        index={getItemIndex( filteredItems, id )}
                                        onClick={() => { goTo( rest.href ) }}
                                        {...rest}
                                    >
                                        <div className='flex items-center w-full'>
                                            <Text style={{ marginRight: 5 }}>{heroIcon}</Text>
                                            <Text>{name}</Text>
                                        </div>
                                    </CommandPalette.ListItem>
                                ) )}
                            </CommandPalette.List>
                        ) )
                ) : (
                    <CommandPalette.FreeSearchAction />
                )}
            </CommandPalette.Page>
            <CommandPalette.Page id="System">
                {filteredItems.length ? (
                    filteredItems
                        .filter( list => list.id === "system" )
                        .map( ( list ) => (
                            <CommandPalette.List key={list.id} heading={list.heading}>
                                {list.items.map( ( { id, heroIcon, name, ...rest } ) => (
                                    <CommandPalette.ListItem
                                        key={id}
                                        index={getItemIndex( filteredItems, id )}
                                        onClick={() => { goTo( rest.href ) }}
                                        {...rest}
                                    >
                                        <div className='flex items-center w-full'>
                                            <Text style={{ marginRight: 5 }}>{heroIcon}</Text>
                                            <Text>{name}</Text>
                                        </div>
                                    </CommandPalette.ListItem>
                                ) )}
                            </CommandPalette.List>
                        ) )
                ) : (
                    <CommandPalette.FreeSearchAction />
                )}
            </CommandPalette.Page>
            <CommandPalette.Page id="Mobile">
                {filteredItems.length ? (
                    filteredItems
                        .filter( list => list.id === "mobile" )
                        .map( ( list ) => (
                            <CommandPalette.List key={list.id} heading={list.heading}>
                                {list.items.map( ( { id, heroIcon, name, ...rest } ) => (
                                    <CommandPalette.ListItem
                                        key={id}
                                        index={getItemIndex( filteredItems, id )}
                                        onClick={() => { goTo( rest.href ) }}
                                        {...rest}
                                    >
                                        <div className='flex items-center w-full'>
                                            <Text style={{ marginRight: 5 }}>{heroIcon}</Text>
                                            <Text>{name}</Text>
                                        </div>
                                    </CommandPalette.ListItem>
                                ) )}
                            </CommandPalette.List>
                        ) )
                ) : (
                    <CommandPalette.FreeSearchAction />
                )}
            </CommandPalette.Page>
            <CommandPalette.Page id="Tools">
                {filteredItems.length ? (
                    filteredItems
                        .filter( list => list.id === "misc" )
                        .map( ( list ) => (
                            <CommandPalette.List key={list.id} heading={list.heading}>
                                {list.items.map( ( { id, heroIcon, name, ...rest } ) => (
                                    <CommandPalette.ListItem
                                        key={id}
                                        index={getItemIndex( filteredItems, id )}
                                        onClick={() => { goTo( rest.href ) }}
                                        {...rest}
                                    >
                                        <div className='flex items-center w-full'>
                                            <Text style={{ marginRight: 5 }}>{heroIcon}</Text>
                                            <Text>{name}</Text>
                                        </div>
                                    </CommandPalette.ListItem>
                                ) )}
                            </CommandPalette.List>
                        ) )
                ) : (
                    <CommandPalette.FreeSearchAction />
                )}
            </CommandPalette.Page>
        </CommandPalette>
    );
};

export default CommandNavigation;