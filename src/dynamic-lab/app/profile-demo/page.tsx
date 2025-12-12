import ProfilePage from '../../../../templates/profile/mongodb/frontend/ProfilePage';
import { getUser } from '../../../../templates/profile/mongodb/actions';

export default async function Page() {
    const user = await getUser();
    return <ProfilePage user={user} />;
}
