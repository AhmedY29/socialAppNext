import CreatePostComponent from "@/components/CreatePost";
import SuggestedUser from "@/components/SuggestedUser";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10">

      <div className="lg:col-span-6 w-full">
        {user ? <CreatePostComponent /> : null}
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <SuggestedUser />
      </div>
    </div>
  );
}
