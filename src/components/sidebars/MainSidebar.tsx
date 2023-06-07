import { AiOutlineHome } from 'solid-icons/ai';
import { CgMoreO, CgProfile } from 'solid-icons/cg';
import { IoNotificationsCircleOutline } from 'solid-icons/io';
import { RiMapCompassDiscoverLine } from 'solid-icons/ri';
import { Component } from 'solid-js';

const MainSidebar: Component = () => {
  return (
    <header class="lg:flex-grow flex-it items-end">
      <div class="xl:w-80 w-20 flex-it">
        <div class="h-full fixed flex-it top-0">
          <div class="flex-it h-full xl:w-80 w-20 overflow-y-auto px-3 justify-between">
            <div class="flex-it items-start">
              <div class="p-3 pt-4 xl:pb-3 pb-0 xl:text-2xl text-sm font-bold transition duration-200 hover:opacity-80">
                <a href="#">
                  <h1>Glider</h1>
                </a>
              </div>
              <div class="my-1 w-full flex-it">
                <nav class="flex-it items-start">
                  <a class="flex-it items-start flex-grow w-full" href="#">
                    <div class="p-3 flex-row justify-center items-center flex-it rounded-3xl hover:bg-gray-800 hover:rounded-3xl transition duration-200">
                      <div class="flex-it">
                        <AiOutlineHome fill="white" size={24} />
                      </div>
                      <div class="mx-4 text-2xl truncate xl:block hidden">
                        <span class="truncate">Home</span>
                      </div>
                    </div>
                  </a>
                  <a class="flex-it items-start flex-grow w-full" href="#">
                    <div class="p-3 flex-row justify-center items-center flex-it rounded-3xl hover:bg-gray-800 hover:rounded-3xl transition duration-200">
                      <div class="flex-it">
                        <CgProfile size={24} />
                      </div>
                      <div class="mx-4 text-2xl truncate xl:block hidden">
                        <span class="truncate">Profile</span>
                      </div>
                    </div>
                  </a>
                  <a class="flex-it items-start flex-grow w-full" href="#">
                    <div class="p-3 flex-row justify-center items-center flex-it rounded-3xl hover:bg-gray-800 hover:rounded-3xl transition duration-200">
                      <div class="flex-it">
                        <CgMoreO size={24} />
                      </div>
                      <div class="mx-4 text-2xl truncate xl:block hidden">
                        <span class="truncate">More</span>
                      </div>
                    </div>
                  </a>
                  <a class="flex-it items-start flex-grow w-full" href="#">
                    <div class="p-3 flex-row justify-center items-center flex-it rounded-3xl hover:bg-gray-800 hover:rounded-3xl transition duration-200">
                      <div class="flex-it">
                        <IoNotificationsCircleOutline fill="white" size={24} />
                      </div>
                      <div class="mx-4 text-2xl truncate xl:block hidden">
                        <span class="truncate">Notification</span>
                      </div>
                    </div>
                  </a>
                  <a class="flex-it items-start flex-grow w-full" href="#">
                    <div class="  p-3 flex-row justify-center items-center flex-it rounded-3xl hover:bg-gray-800 hover:rounded-3xl transition duration-200">
                      <div class="flex-it">
                        <RiMapCompassDiscoverLine fill="white" size={24} />
                      </div>
                      <div class="mx-4 text-2xl truncate xl:block hidden">
                        <span class="truncate">Discover</span>
                      </div>
                    </div>
                  </a>
                </nav>
              </div>
              {/* GLIDER SEND-MESSAGE BUTTON */}
              <div class="my-1 flex-it w-10/12 cursor-pointer">
                <div class="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full flex-it transition">
                  <div class="flex-it flex-row text-xl font-bold text-white items-start justify-center truncate duration-200">
                    <div>Glide It</div>
                  </div>
                </div>
              </div>
            </div>
            {/* PROFILE MENU */}
            <div class="flex-it my-3 hover:cursor-pointer">{/*<UserSettingPopup />*/}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainSidebar;
