import { equalTo, get, orderByChild, query, ref } from "firebase/database";

// Name initials function
export function getNameInitials(name) {
  const splitName = name.toUpperCase().split(" ");
  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }
  return splitName[0][0];
}

// Transformation to Array with id
export function transfromToArrWithId(snapValue) {
  return snapValue
    ? Object.keys(snapValue).map((roomId) => {
        return { ...snapValue[roomId], id: roomId };
      })
    : [];
}

// Transformation to Array
export function transfromToArr(snapValue) {
  return snapValue ? Object.keys(snapValue): [];
}

// Functions to getting users update
export async function getUserUpdates(userId, keyToUpdate, value, database) {
  const updates = {};
  updates[`profiles/${userId}/${keyToUpdate}`] = value;

  const msgDbRef = ref(database, "messages");
  const msgsQuery = query(
    msgDbRef,
    orderByChild("author/uid"),
    equalTo(userId)
  );

  const roomDbRef = ref(database, "rooms");
  const roomsQuery = query(
    roomDbRef,
    orderByChild("lastMessage/author/uid"),
    equalTo(userId)
  );

  const [msgSnap, roomSnap] = await Promise.all([
    get(msgsQuery),
    get(roomsQuery),
  ]);
  msgSnap.forEach((msgChild) => {
    updates[`/messages/${msgChild.key}/author/${keyToUpdate}`] = value;
  });
  roomSnap.forEach((roomChild) => {
    updates[`/rooms/${roomChild.key}/lastMessage/author/${keyToUpdate}`] =
      value;
  });
  return updates;
}

export function groupBy(array ,groupingKeyFn){
  return array.reduce((result,item)=>{
    const groupingKey = groupingKeyFn(item);
    if(!result[groupingKey]){
      result[groupingKey] = [];
    }
    result[groupingKey].push(item);  
    return result;
  },{})
}