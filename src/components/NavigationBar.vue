<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand">5eTools</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <RouterLink to="/" class="nav-link">Login</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink to="/ManageCharacters" class="nav-link">Manage Characters</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink to="/CharacterCreator" class="nav-link">Character Creator</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink to="/CampaignTools" class="nav-link">Campaign Tools</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink to="/InitiativeTracker" class="nav-link">Initaitve Tracker</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
        name: 'NavigationComponent'
    }
</script>
