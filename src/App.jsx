import { nanoid } from "nanoid";
import { useState } from "react";

const initialFriends = [
  {
    id: nanoid(),
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: nanoid(),
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: nanoid(),
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const App = () => {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="container grid grid-2-cols">
      <div className="grid-item">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        <FormAddFriend
          showAddFriend={showAddFriend}
          onAddFriend={handleAddFriend}
        />
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add"}
        </Button>
      </div>
      <div className="grid-item">
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
            key={selectedFriend.id}
          />
        )}
      </div>
    </div>
  );
};

function Button({ children, onClick }) {
  return (
    <button className="btn" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ friends, selectedFriend, onSelection }) {
  return (
    <ul className="list">
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "list-item selected" : "list-item"}>
      <div className="list-desc">
        <img src={friend.image} alt={friend.name} />
        <div className="list-desc-text">
          <span className="list-label">{friend.name}</span>
          {friend.balance < 0 && (
            <p className="list-info red">
              You owe {friend.name} ${Math.abs(friend.balance)}
            </p>
          )}
          {friend.balance > 0 && (
            <p className="list-info green">
              {friend.name} owes you ${Math.abs(friend.balance)}
            </p>
          )}
          {friend.balance === 0 && (
            <p className="list-info">You and {friend.name} are even</p>
          )}
        </div>
      </div>
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ showAddFriend, onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <>
      {showAddFriend && (
        <form className="form-add-friend" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>👬 Friend Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>📷 Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
          <Button> Add</Button>
        </form>
      )}
    </>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <div>
      <h3>Split bill with {selectedFriend.name}</h3>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>💰 Bill</label>
          <input
            type="text"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>🧍‍♂️ Your expense</label>
          <input
            type="text"
            value={paidByUser}
            onChange={(e) => setPaidByUser(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>👬 {selectedFriend.name}&apos;s expense</label>
          <input type="text" value={paidByFriend} disabled />
        </div>
        <div className="form-group">
          <label>😁 Who&apos;s paying the bill?</label>
          <select
            value={whoIsPaying}
            onChange={(e) => setWhoIsPaying(e.target.value)}
          >
            <option value="user">You</option>
            <option value="friend">{selectedFriend.name}</option>
          </select>
        </div>
        <div className="form-group">
          &nbsp;
          <Button>Split Bill</Button>
        </div>
      </form>
    </div>
  );
}

export default App;
