<script lang="ts" setup>
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const isNavOpen = ref(false);
const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value;
};

const sideBar = {
  open: "w-screen md:w-80 h-auto border-r border-slate-200 dark:border-slate-800 min-h-screen bg-white dark:bg-slate-900",
  close: "hidden bg-red-500",
};

const navBar = {
  open: "w-full md:block hidden bg-slate-100 dark:bg-slate-900 min-h-screen",
  close: "w-screen bg-slate-100 dark:bg-slate-900 min-h-screen",
};

const links = [
  [
    {
      label: "หน้าหลัก",
      to: "/",
    },
    // {
    //   label: "sim",
    //   to: "/sim",
    // },
    // {
    //   label: "graph",
    //   to: "/sim/graph",
    // },
  ],
  [
    {
      label: "ข้อมูลหลักสูตร",
      to: "/curriculums",
    },
    {
      label: "ข้อมูลระดับการศึกษา",
      to: "/degrees",
    },
    {
      label: "ข้อมูลคณะ",
      to: "/faculties",
    },
    {
      label: "ข้อมูลกลุ่มคณะ",
      to: "/faculty-groups",
    },
    {
      label: "ข้อมูลประเภทรายวิชา",
      to: "/subject-types",
    },
    {
      label: "ข้อมูลประเภทวิชาชีพ",
      to: "/subject-occupation-types",
    },
  ],
  [
    {
      label: "อัพโหลดข้อมูลหลักสูตร",
      to: "/excel-upload/curriculums",
    },
    {
      label: "อัพโหลดข้อมูลรายวิชา",
      to: "/excel-upload/subjects",
    },
  ],
  [{ label: "กู้คืนข้อมูลหลักสูตร", to: "/curriculums/trash" }],
];
</script>

<template>
  <div class="flex w-screen">
    <div :class="isNavOpen ? sideBar.open : sideBar.close">
      <div class="flex justify-end">
        <ClientOnly>
          <UButton :icon="isNavOpen
              ? 'i-heroicons-x-mark-20-solid'
              : 'i-heroicons-bars-3-solid'
            " aria-label="Theme" class="md:hidden" color="slate" variant="ghost" @click="toggleNav()" />
        </ClientOnly>
      </div>
      <div class="sticky top-0 p-4">
        <UVerticalNavigation :links="links" />
      </div>
    </div>
    <div :class="isNavOpen ? navBar.open : navBar.close">
      <nav
        class="bg-white dark:bg-slate-900 backdrop-blur border-b border-slate-200 dark:border-slate-800 -mb-px sticky top-0 z-50 px-2">
        <div class="flex flex-wrap justify-between items-center mx-auto p-2">
          <div class="flex items-center">
            <ClientOnly>
              <UButton :icon="isNavOpen
                  ? 'i-heroicons-x-mark-20-solid'
                  : 'i-heroicons-bars-3-solid'
                " color="gray" size="xl" variant="ghost" @click="toggleNav()" />
            </ClientOnly>
            <router-link class="items-center gap-2 mx-2 flex" to="/">
              <!--              <img-->
              <!--                alt="Burapha University Logo"-->
              <!--                class="w-10"-->
              <!--                src="https://www.informatics.buu.ac.th/2020/wp-content/uploads/2018/04/logo-informatics.png"-->
              <!--              />-->
              <span class="self-center text-xl whitespace-nowrap dark:text-white md:block hidden">
                BUU-CROSSCHECK
              </span>
            </router-link>
          </div>
          <ClientOnly>
            <UButton :icon="isDark
                ? 'i-heroicons-moon-20-solid'
                : 'i-heroicons-sun-20-solid'
              " aria-label="Theme" color="gray" size="lg" variant="ghost" @click="isDark = !isDark" />
          </ClientOnly>
        </div>
      </nav>
      <slot />
      <UNotifications />
    </div>
  </div>
</template>
