import { useDispatch, useSelector } from "react-redux";
import { setIsFollowingUserTrue } from "../../redux/isFollowingUserSlice";

function FollowUserButton() {
    const dispatch = useDispatch();
    const isFollowingUser = useSelector(state => state.isFollowingUser.value);

    return (
        !isFollowingUser ? (
            <div className="follow-user">
                <button onClick={() => dispatch(setIsFollowingUserTrue())}>Follow User</button>
            </div >
        )
            : null
    )
}

export default FollowUserButton;