import React from "react";
import HeaderItem from "./HeaderItem";
import Image from "next/image";


export const HeaderMenu = () => {
    return (
        <div>  
            <HeaderItem
                title="User Management"
                left={
                    <button
                        style={{
                            background: "#fff7e6",
                            border: "none",
                            borderRadius: "50%",
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <Image src="/images/icons/back.svg" alt="logo" width={28} height={28} />
                    </button>
                }
                right={
                    <button
                        style={{
                            border: "none",
                            background: "#ff9800",
                            color: "#fff",
                            borderRadius: 6,
                            padding: "4px 18px",
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Thêm mới
                    </button>
                }
            />
        </div>
    )
}

export default HeaderMenu;
