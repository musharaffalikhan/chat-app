import React, { memo } from "react";
import { Button } from "rsuite";
import TimeAgo from "timeago-react";
import { useCurrentRoom } from "../../../Auth/Current-room-context";
import { auth } from "../../../Firebase/Firebase";
import { useHover } from "../../../Hooks/UseHover";
import ProfileAvatar from "../../Dashboard/ProfileAvatar";
import PresenceDot from "../../PresenceDot";
import ProfileInfoModal from "./ProfileInfoModal";
import { RiHeartFill } from "react-icons/ri";
import IconBtnControl from "./IconBtnControl";
import { useMediaQuery } from "@mui/material";

const MessageItem = ({ message, handleAdminPass, handleLike }) => {
  const { author, createdAt, text, likes, likeCount } = message;

  const [selfRef, isHover] = useHover();
  const isMobile = useMediaQuery("(max-width:992px)");

  const isAdmin = useCurrentRoom((state) => state.isAdmin);
  const admins = useCurrentRoom((state) => state.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAccess = isAdmin && !isAuthor;

  const canShowIcons = isMobile || isHover;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);
  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHover ? "bg-black-02" : ""}`}
      ref={selfRef}
    >
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />
        <ProfileInfoModal
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-black"
        >
          {canGrantAccess && (
            <Button
              block
              onClick={() => handleAdminPass(author.uid)}
              color="blue"
              appearance="primary"
            >
              {isMsgAuthorAdmin
                ? "Remove admin permission"
                : "Give admin in this room"}
            </Button>
          )}
        </ProfileInfoModal>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
        <IconBtnControl
          {...(isLiked)}
          isVisible={canShowIcons}
          iconName={<RiHeartFill />}
          tooltip="Like this message"
          onClick={() => handleLike(message.id)}
          badgeContent={likeCount}
        />
      </div>
      <div>
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default memo(MessageItem);
