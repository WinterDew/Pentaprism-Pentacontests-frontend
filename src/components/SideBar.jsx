import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faImages, faHome, faUserCog, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

    const navigator = useNavigate();
    const topActions = [
        {"icon": faHome, "label": "Home", "key": "home"},
        {"icon": faImages, "label": "Gallery", "key": "gallery"},
    ];
    const bottomActions = [
        {"icon": faUpload, "label": "Submit Entry", "key": "submission"},
        {"icon": faUserCog, "label": "Account Settings", "key": "account"}
    ];
    const logo = {"icon": faCamera, "label": "Pentacontests", "onClick": () => {navigator("/")}};
    const onActionClick = {
        "home" : () => {navigator("/")},
        "gallery" : () => {navigator("/gallery")},
        "submission" : () => {navigator("/submission")},
        // "account" : () => {setShowConfirmLogout(true)},
        "account" : () => {navigator("/account-settings")},
    };


  return (
    <div className="z-50">
      {/* Desktop Sidebar */}
      
      <div className="hidden md:flex flex-col fixed top-0 left-0 h-full w-16 bg-base-200 shadow-lg pt-4 pb-4 items-center justify-between">
        <div className="flex flex-col space-y-4">
          {logo && (
            <>
              <div className="tooltip tooltip-right" data-tip={logo.label}>
                <button
                  className="btn btn-square btn-ghost text-lg"
                  onClick={() => logo.onClick?.()}
                >
                  <FontAwesomeIcon icon={logo.icon} />
                </button>
              </div>
              <div className="divider" />
            </>
          )}
          {topActions.map(({ icon, label, key }) => (
            <div key={key} className="tooltip tooltip-right" data-tip={label}>
              <button
                className="btn btn-square btn-ghost text-lg"
                onClick={() => onActionClick[key]?.()}
              >
                <FontAwesomeIcon icon={icon} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-4">
          {bottomActions.map(({ icon, label, key }) => (
            <div key={key} className="tooltip tooltip-right" data-tip={label}>
              <button
                className="btn btn-square btn-ghost text-lg"
                onClick={() => onActionClick[key]?.()}
              >
                <FontAwesomeIcon icon={icon} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Dock */}
      <div className="md:hidden dock">
          {[...topActions, ...bottomActions].map(
            ({ icon, label, key }) => (
              <button
                key={key || label}
                className="btn btn-ghost btn-square flex-1 min-w-[60px] flex flex-col items-center justify-center"
                onClick={() => {
                  if (key) onActionClick[key]?.();
                  else logo?.onClick?.();
                }}
                aria-label={label}
              >
                <FontAwesomeIcon icon={icon} />
                <span className="dock-label">{label}</span>
              </button>
            )
          )}
      </div>
    </div>
  );
};

export default Sidebar;
