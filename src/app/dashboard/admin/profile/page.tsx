import ProfileInfos from "./components/profile-info";
import { userProfileData } from "./data";
const Parameters = () => {
  return (
    <div>
      <ProfileInfos user={userProfileData} />
    </div>
  );
};
export default Parameters;
