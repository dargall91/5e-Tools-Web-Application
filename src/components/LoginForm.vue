<template>
  <div class="container">
    <div v-if="user.user.value.id === 0" id="loginForm">
      <h2 class="mt-2">Login</h2>

      <CButtonGroup role="group">
        <CFormCheck type="radio" :button="{color: 'dark', variant: 'outline'}" name="loginRegister" @click="loginClicked" id="login" autocomplete="off" label="Login" checked />
        <CFormCheck type="radio" :button="{color: 'dark', variant: 'outline'}" name="loginRegister" @click="registerClicked" id="register" autocomplete="off" label="Register" />
      </CButtonGroup>

      <CForm @submit.prevent="submit">
        <CFormFloating class="mb-3 mt-3">
          <CFormInput v-model="username" required type="username" class="form-control" id="username" placeholder="Username" />
          <CFormLabel for="username">Username</CFormLabel>
        </CFormFloating>

        <CFormFloating class="mb-3">
          <CFormInput v-model="password" required type="password" class="form-control" id="password" placeholder="Password" />
          <CFormLabel for="password">Password</CFormLabel>
        </CFormFloating>

        <!-- <CFormCheck class="mb-3" label="Remember Me" type="checkbox" name="remember" /> -->

        <CButton color="dark" type="submit" class="btn btn-primary">Submit</CButton>
      </CForm>
    </div>
    <div v-else>
      <h3 class="mt-2">Logged in as {{ user.user.value.username }}</h3>

      <CForm @submit.prevent="logout">
        <CButton color="dark" type="submit" class="btn btn-primary">Logout</CButton>
      </CForm>
    </div>
  </div>
</template>

<script lang="ts">
  import { CFormFloating, CForm, CFormInput, CFormLabel, CFormCheck, CButton, CButtonGroup } from '@coreui/vue'
  import { useUserStore } from '@/stores/UserStore'
  import { defineComponent } from 'vue'
  import { storeToRefs } from 'pinia'
  import { LoginRegisterRequest } from '@/models/LoginRegisterRequest'

  export default defineComponent ({
    name: "LoginForm",
    components: { CFormFloating, CForm, CFormInput, CFormLabel, CFormCheck, CButton, CButtonGroup },
    setup() {
      return {user: storeToRefs(useUserStore())};
    },
    data() {
      return {
        username: "",
        password: "",
        userLogin: true,
        login: useUserStore().login,
        register: useUserStore().register,
        logout: useUserStore().logout,
      }
    },
    methods: {
      async submit() {
        const request: LoginRegisterRequest = { username: this.username, password: this.password };

        if (this.userLogin === true) {
          await this.login(request);
        } else {
          await this.register(request);
        }
      },
      loginClicked() {
        this.userLogin = true;
      },
      registerClicked() {
        this.userLogin = false;
      }
    }
  })
</script>
