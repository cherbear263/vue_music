<template>
<div class="text-white text-center font-bold p-5 mb-4"
    v-if="reg_show_alert" :class="reg_alert_variant" >
    {{ reg_alert_msg }}
</div>
<vee-form  :validation-schema="schema" :initial-values="userData"
@submit="register">
<!-- Name -->
<div class="mb-3">
    <label class="inline-block mb-2">Name</label>
    <vee-field type="text" name="name"
    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
        duration-500 focus:outline-none focus:border-black rounded"
    placeholder="Enter Name" />
    <ErrorMessage class="text-red-600" name="name" />
</div>
<!-- Email -->
<div class="mb-3">
    <label class="inline-block mb-2">Email</label>
    <vee-field type="email" name="email"
    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
        duration-500 focus:outline-none focus:border-black rounded"
    placeholder="Enter Email" />
    <ErrorMessage class="text-red-600" name="email" />
</div>
<!-- Age -->
<div class="mb-3">
    <label class="inline-block mb-2">Age</label>
    <vee-field type="number" name="age"
    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
        duration-500 focus:outline-none focus:border-black rounded"/>
    <ErrorMessage class="text-red-600" name="age" />
</div>
<!-- Password -->
<div class="mb-3">
    <label class="inline-block mb-2">Password</label>
    <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
        transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
        type="password" v-bind="field" :bails="false" />
        <div class="text-red-600" v-for="error in errors" :key="error">
        {{ error }}
        </div>
    </vee-field>
    <ErrorMessage class="text-red-600" name="password" />
</div>
<!-- Confirm Password -->
<div class="mb-3">
    <label class="inline-block mb-2">Confirm Password</label>
    <vee-field type="password" name="confirm_password"
    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
        duration-500 focus:outline-none focus:border-black rounded"
    placeholder="Confirm Password" />
    <ErrorMessage class="text-red-600" name="confirm_password" />
</div>
<!-- Country -->
<div class="mb-3">
    <label class="inline-block mb-2">Country</label>
    <vee-field as="select" name="country" :initial-values="userData.country"
    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
        duration-500 focus:outline-none focus:border-black rounded">
    <option value="Aus">Australia</option>
    <option value="USA">Canada</option>
    <option value="GER">Germany</option>
    <option value="FR">France</option>
    <option value="SIN">Singapore</option>
    <option value="NZ">New Zealand</option>
    <option value="Antarctica">Antarctica</option>
    </vee-field>
    <ErrorMessage class="text-red-600" name="country" />
</div>
<div class="mb-3">
  <label class="inline-block mb-2">What are your favourite genres of music?</label>
  <div class="form-group form-check" v-for="genre in genresList" v-bind:key="genre.genre"
  :value="genre.genre">
    <vee-field type="checkbox" v-model="userData.genres"
    name="genres" :value="genre.genre" />
    <span class="ml-2 text-sm">{{ genre.genre }}</span>
  </div>
 <!-- <div class="grid grid-cols-4 gap-4">
    <label class="flex items-center">
      <input type="checkbox" value="pop" name="genre" :initial-values="userData"/>
      <span class="ml-2 text-sm">Pop</span>
      </label>
  </div> -->
</div>
<!-- TOS -->
<div class="mb-3 pl-6">
    <vee-field type="checkbox" name="tos"
    value="1" class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
    <label class="inline-block">Accept terms of service</label>
    <ErrorMessage class="text-red-600" name="tos" />
</div>
<button type="submit" :disabled="reg_in_submission"
    class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
    hover:bg-purple-700">
    Submit
</button>
</vee-form>
</template>
<script>

export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|numeric',
        password: 'required|min:7|max:32',
        confirm_password: 'confirmed:@password',
        country: 'required',
        genres: '',
        tos: 'tos',
      },
      genresList: [
        { genre: 'pop' },
        { genre: 'hip hop' },
        { genre: 'blues' },
        { genre: 'punk rock' },
        { genre: 'country' },
        { genre: 'Indie rock' },
        { genre: 'classical' },
        { genre: 'other' },
      ],
      userData: {
        country: 'Australia',
        genres: [],
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'Please wait! Your account is being created.',

    };
  },
  methods: {
    async register(values) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = 'bg-blue-500';
      this.reg_alert_msg = 'Please wait! Your account is being created.';

      // Create the user in Firebase database
      try {
        await this.$store.dispatch('register', values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = 'bg-red-500';
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/weak-password') {
          this.reg_alert_msg = 'The password is too weak.';
        } else {
          this.reg_alert_msg = errorMessage;
        }
        // this.reg_alert_msg = 'An unexpected error occurred. Please try again later.';
        return;
      }

      this.reg_alert_variant = 'bg-green-500';
      this.reg_alert_msg = 'Success! Your account has been created.';
      // page refresh
      window.location.reload();
    },
  },
};
</script>
