import React, { memo } from "react";
import { Button } from "rsuite";
import TimeAgo from "timeago-react";
import { useCurrentRoom } from "../../../Auth/Current-room-context";
import { auth } from "../../../Firebase/Firebase";
import { useHover } from "../../../Hooks/UseHover";
import ProfileAvatar from "../../Dashboard/ProfileAvatar";
import PresenceDot from "../../PresenceDot";
import ProfileInfoModal from "./ProfileInfoModal";

const MessageItem = ({ message,handleAdminPass }) => {
  const { author, createdAt, text } = message;

  const [selfRef, isHover] = useHover()

  const isAdmin = useCurrentRoom((state) => state.isAdmin);
  const admins = useCurrentRoom((state) => state.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAccess = isAdmin && !isAuthor;
  return (
    <li className={`padded mb-1 cursor-pointer ${isHover? 'bg-black-02':''}`} ref={selfRef}>
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
            <Button block onClick={() => handleAdminPass(author.uid)} color="blue" appearance="primary">
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
      </div>
      <div>
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default memo(MessageItem);
