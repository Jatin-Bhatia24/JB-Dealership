
const car_name = document.getElementById("car-name");
const car_model = document.getElementById("car-model");
const car_year = document.getElementById("car-year");

const search_btn = document.getElementById("search");
const result = document.getElementById("result");
const container2 = document.querySelector(".container2");

const main_ui = document.querySelector(".main-ui");
const view = document.querySelector(".view");
const close_btn = document.getElementById("close_btn");

const year_model_make = document.getElementById("year_model_make");
const hero_section_image = document.getElementById("hero-section-image");
const name = document.getElementById("name");
const base_msrp = document.getElementById("base_msrp");
const total_seating = document.getElementById("total_seating");
const horse_power = document.getElementById("horse_power");
const gearbox = document.getElementById("gearbox");

const vehicle_type = document.getElementById("vehicle_type");
const model_year = document.getElementById("model_year");
const overview_seating = document.getElementById("overview_seating");
const trim = document.getElementById("trim");

const performance_hp = document.getElementById("performance_hp");
const torque = document.getElementById("torque");
const zero_sixty = document.getElementById("zero_sixty");
const top_speed = document.getElementById("top_speed");

const engine_type = document.getElementById("engine_type");
const cylinders = document.getElementById("cylinders");
const displacement = document.getElementById("displacement");
const engine_layout = document.getElementById("engine_layout");
const drive_type = document.getElementById("drive_type");
const engine_transmission = document.getElementById("engine_transmission");

const length = document.getElementById("length");
const width = document.getElementById("width");
const height = document.getElementById("height");
const weight = document.getElementById("weight");

const fuel_type = document.getElementById("fuel_type");
const fuel_economy = document.getElementById("fuel_economy");
const fuel_transmission = document.getElementById("fuel_transmission");
const fuel_drive = document.getElementById("fuel_drive");

const exterior_color = document.getElementById("exterior_color");
const interior_color = document.getElementById("interior_color");

function valueOrNA(value) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "N/A";
    }

    return value;
}

function getCategory(car, categoryName) {
    if (
        !car ||
        !car.features ||
        !Array.isArray(car.features.standard)
    ) {
        return [];
    }

    const category = car.features.standard.find(
        item =>
            item.category &&
            item.category.toLowerCase() === categoryName.toLowerCase()
    );

    return category ? category.features || [] : [];
}

function getFeature(car, categoryName, featureName) {
    const features = getCategory(car, categoryName);

    const feature = features.find(
        item =>
            item.name &&
            item.name.toLowerCase() === featureName.toLowerCase()
    );

    return feature ? feature.value : null;
}

function findFeature(car, categoryName, searchText) {
    const features = getCategory(car, categoryName);

    const feature = features.find(
        item =>
            item.name &&
            item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return feature ? feature.value : null;
}

function setText(element, value) {
    if (!element) {
        return;
    }

    element.textContent = valueOrNA(value);
}

function extractBodyType(car) {
    const carName = car && car.name ? car.name.toLowerCase() : "";

    if (carName.includes("suv")) return "SUV";
    if (carName.includes("sedan")) return "Sedan";
    if (carName.includes("coupe")) return "Coupe";
    if (carName.includes("convertible")) return "Convertible";
    if (carName.includes("wagon")) return "Wagon";
    if (carName.includes("hatchback")) return "Hatchback";

    return "N/A";
}

search_btn.addEventListener("click", async () => {
    const carName = car_name.value.trim();
    const carModel = car_model.value.trim();
    const carYear = car_year.value.trim();

    if (carName === "") {
        car_name.focus();
        return;
    }

    if (carModel === "") {
        car_model.focus();
        return;
    }

    if (carYear === "") {
        car_year.focus();
        return;
    }

    result.textContent = "Searching...";
    container2.replaceChildren();

    try {
        const API_BASE_URL = "https://jb-dealership-api.onrender.com";

const carUrl =
    `${API_BASE_URL}/api/car` +
    `?name=${encodeURIComponent(carName)}` +
    `&model=${encodeURIComponent(carModel)}` +
    `&year=${encodeURIComponent(carYear)}`;

        const carResponse = await fetch(carUrl);

        if (!carResponse.ok) {
            throw new Error("Car API request failed");
        }

        const data = await carResponse.json();

        console.log("CAR API RESPONSE:", data);

        if (data.success === false || !data.bestMatch) {
            result.textContent = data.message || "Car not found";
            return;
        }

        let imageData = {
            success: false,
            images: []
        };

        try {
            const imageUrl =
    `${API_BASE_URL}/api/car-image` +
    `?make=${encodeURIComponent(carName)}` +
    `&model=${encodeURIComponent(carModel)}` +
    `&year=${encodeURIComponent(carYear)}`;

            const imageResponse = await fetch(imageUrl);

            if (imageResponse.ok) {
                imageData = await imageResponse.json();
            }
        } catch (imageError) {
            console.log("Image API failed:", imageError);
        }

        console.log("IMAGE API RESPONSE:", imageData);

        result.textContent = "Car Found!";

        addCard(data, imageData);
    } catch (error) {
        console.error(error);
        result.textContent = "Something went wrong.";
    }
});

function addCard(data, imageData) {
    const car = data.bestMatch;

    container2.replaceChildren();

    const div = document.createElement("div");
    div.className = "cards";

    let image = "";

    if (
        imageData &&
        imageData.success &&
        Array.isArray(imageData.images) &&
        imageData.images.length > 0
    ) {
        image = imageData.images[0].link;
    }

    const img = document.createElement("img");
    img.src = image;
    img.alt = `${valueOrNA(car.make)} ${valueOrNA(car.model)}`;

    const carTitle = document.createElement("h2");
    carTitle.className = "carname";
    carTitle.textContent = `${valueOrNA(car.make)} ${valueOrNA(car.model)}`;

    const year = document.createElement("p");
    year.className = "year";
    year.textContent = valueOrNA(car.year);

    const tag = document.createElement("p");
    tag.className = "tag";
    tag.textContent = valueOrNA(car.name);

    const viewButton = document.createElement("button");
    viewButton.className = "detail";
    viewButton.textContent = "View Details";

    div.append(img, carTitle, year, tag, viewButton);
    container2.appendChild(div);

    viewButton.addEventListener("click", () => {
        main_ui.classList.add("inactive");
        view.classList.add("active");

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

        showCarDetails(car, image);
    });
}

function showCarDetails(car, image) {
    console.log("SELECTED CAR:", car);

    setText(
        year_model_make,
        `${valueOrNA(car.year)} ${valueOrNA(car.make)} ${valueOrNA(car.model)}`
    );

    setText(name, car.name);

    if (hero_section_image) {
        hero_section_image.src = image || "";
        hero_section_image.alt =
            `${valueOrNA(car.make)} ${valueOrNA(car.model)}`;
    }

    if (car.base_msrp !== undefined && car.base_msrp !== null) {
        setText(
            base_msrp,
            `$${Number(car.base_msrp).toLocaleString()}`
        );
    } else {
        setText(base_msrp, "Price unavailable");
    }

    const horsepower = findFeature(car, "Engine", "Horsepower");
    const engineSize = findFeature(car, "Engine", "Base engine size");
    const cylindersValue = findFeature(car, "Engine", "Cylinders");
    const engineType = findFeature(car, "Engine", "Base engine type");
    const torqueValue = findFeature(car, "Engine", "Torque");

    const transmissionValue = findFeature(
        car,
        "Drive Train",
        "Transmission"
    );

    const driveValue = findFeature(
        car,
        "Drive Train",
        "Drive type"
    );

    setText(
        total_seating,
        car.total_seating ? `${car.total_seating} Seats` : "N/A"
    );

    setText(horse_power, horsepower);
    setText(gearbox, transmissionValue);

    setText(vehicle_type, extractBodyType(car));
    setText(model_year, car.year);

    setText(
        overview_seating,
        car.total_seating ? `${car.total_seating} Seats` : "N/A"
    );

    setText(trim, car.name);

    setText(performance_hp, horsepower);
    setText(torque, torqueValue);

    const zeroToSixty = findFeature(
        car,
        "Measurements",
        "Manufacturer 0-60"
    );

    setText(zero_sixty, zeroToSixty);
    setText(top_speed, "N/A");

    setText(engine_type, engineType);
    setText(cylinders, cylindersValue);
    setText(displacement, engineSize);
    setText(engine_layout, cylindersValue);
    setText(drive_type, driveValue);
    setText(engine_transmission, transmissionValue);

    const lengthValue = findFeature(
        car,
        "Measurements",
        "Length"
    );

    const widthValue =
        findFeature(
            car,
            "Measurements",
            "Overall width without mirrors"
        ) ||
        findFeature(
            car,
            "Measurements",
            "Overall width"
        );

    const heightValue = findFeature(
        car,
        "Measurements",
        "Height"
    );

    const curbWeightValue = findFeature(
        car,
        "Measurements",
        "Curb weight"
    );

    setText(length, lengthValue);
    setText(width, widthValue);
    setText(height, heightValue);
    setText(weight, curbWeightValue);

    setColors(car);

    const fuelType = findFeature(car, "Fuel", "Fuel type");
    const combinedMpg = findFeature(car, "Fuel", "EPA combined MPG");

    setText(fuel_type, fuelType);
    setText(fuel_economy, combinedMpg);
    setText(fuel_transmission, transmissionValue);
    setText(fuel_drive, driveValue);

    renderFeatures(car);
    renderSafety(car);
    renderInterior(car);
    renderOptions(car);
}

function setColors(car) {
    const exterior =
        car.color && Array.isArray(car.color.exterior)
            ? car.color.exterior
            : [];

    const interior =
        car.color && Array.isArray(car.color.interior)
            ? car.color.interior
            : [];

    setText(
        exterior_color,
        exterior.length
            ? exterior.map(color => color.name).join(", ")
            : "N/A"
    );

    setText(
        interior_color,
        interior.length
            ? interior.map(color => color.name).join(", ")
            : "N/A"
    );

    const exteriorCircle = document.querySelector(
        "#colors .color-circle:not(.interior-color)"
    );

    const interiorCircle = document.querySelector(
        "#colors .interior-color"
    );

    if (exteriorCircle && exterior.length > 0 && exterior[0].rgb) {
        exteriorCircle.style.backgroundColor =
            `rgb(${exterior[0].rgb})`;
    }

    if (interiorCircle && interior.length > 0 && interior[0].rgb) {
        interiorCircle.style.backgroundColor =
            `rgb(${interior[0].rgb})`;
    }
}

function renderFeatures(car) {
    const container = document.querySelector(
        "#features .feature-grid"
    );

    if (!container) {
        return;
    }

    container.replaceChildren();

    const categories =
        car.features && Array.isArray(car.features.standard)
            ? car.features.standard
            : [];

    categories.forEach(category => {
        if (!Array.isArray(category.features)) {
            return;
        }

        const heading = document.createElement("h3");
        heading.className = "feature-category-title";
        heading.textContent = category.category;

        container.appendChild(heading);

        category.features.forEach(feature => {
            const div = document.createElement("div");
            div.className = "feature-item";

            const icon = document.createElement("i");
            icon.className = "fa-solid fa-check";

            const span = document.createElement("span");
            const value =
                feature.value !== null &&
                feature.value !== undefined &&
                feature.value !== ""
                    ? ` : ${feature.value}`
                    : "";

            span.textContent = `${feature.name}${value}`;

            div.append(icon, span);
            container.appendChild(div);
        });
    });
}

function renderSafety(car) {
    const container = document.querySelector(
        "#safety .feature-grid"
    );

    if (!container) {
        return;
    }

    container.replaceChildren();

    const features = getCategory(car, "Safety");

    if (!features.length) {
        const div = document.createElement("div");
        div.className = "feature-item";

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-circle-info";

        const span = document.createElement("span");
        span.textContent = "No safety information available";

        div.append(icon, span);
        container.appendChild(div);
        return;
    }

    features.forEach(feature => {
        const div = document.createElement("div");
        div.className = "feature-item";

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-shield-halved";

        const span = document.createElement("span");

        const value =
            feature.value !== null &&
            feature.value !== undefined &&
            feature.value !== ""
                ? ` : ${feature.value}`
                : "";

        span.textContent = `${feature.name}${value}`;

        div.append(icon, span);
        container.appendChild(div);
    });
}

function renderInterior(car) {
    const container = document.querySelector(".interior-grid");

    if (!container) {
        return;
    }

    container.replaceChildren();

    const interiorCategories = [
        "Frontseats",
        "Rearseats",
        "Comfort & Convenience",
        "In Car Entertainment",
        "Instrumentation",
        "Telematics"
    ];

    interiorCategories.forEach(categoryName => {
        const features = getCategory(car, categoryName);

        if (!features.length) {
            return;
        }

        const heading = document.createElement("h3");
        heading.className = "feature-category-title";
        heading.textContent = categoryName;

        container.appendChild(heading);

        features.forEach(feature => {
            const div = document.createElement("div");
            div.className = "interior-card";

            const title = document.createElement("h3");
            title.textContent = feature.name;

            const paragraph = document.createElement("p");
            paragraph.textContent = valueOrNA(feature.value || "Available");

            div.append(title, paragraph);
            container.appendChild(div);
        });
    });
}

function renderOptions(car) {
    const container = document.querySelector(".options-list");

    if (!container) {
        return;
    }

    container.replaceChildren();

    const categories =
        car.features && Array.isArray(car.features.optional)
            ? car.features.optional
            : [];

    categories.forEach(category => {
        const heading = document.createElement("h3");
        heading.className = "feature-category-title";
        heading.textContent = category.category;

        container.appendChild(heading);

        if (!Array.isArray(category.features)) {
            return;
        }

        category.features.forEach(option => {
            const div = document.createElement("div");
            div.className = "option";

            const icon = document.createElement("i");
            icon.className = "fa-solid fa-check";

            const span = document.createElement("span");

            let price = "";

            if (option.price !== null && option.price !== undefined) {
                price = ` - $${Number(option.price).toLocaleString()}`;
            }

            span.textContent = `${option.name}${price}`;

            div.append(icon, span);
            container.appendChild(div);
        });
    });
}

document.addEventListener("click", event => {
    if (event.target.closest("#close_btn")) {
        console.log("CLOSE BUTTON WORKING");

        view.classList.remove("active");
        main_ui.classList.remove("inactive");

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
});

function enterSearch(input) {
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            search_btn.click();
        }
    });
}

enterSearch(car_name);
enterSearch(car_model);
enterSearch(car_year);

const your_name = document.getElementById("your_name");
const phone_number = document.getElementById("phone_number");
const your_email = document.getElementById("your_email");
const message = document.getElementById("message");
const error = document.getElementById("error");
const send = document.getElementById("send");

send.addEventListener("click", () => {
    const ur_name = your_name.value.trim();
    const phn_no = phone_number.value.trim();
    const ur_email = your_email.value.trim();
    const msg = message.value.trim();

    if (ur_name === "") {
        your_name.focus();
        error.textContent = "Please Enter Your Name";
        return;
    }

    if (phn_no === "") {
        phone_number.focus();
        error.textContent = "Please Enter Your Phone Number";
        return;
    }

    if (ur_email === "") {
        your_email.focus();
        error.textContent = "Please Enter Your E-mail";
        return;
    }

    if (msg === "") {
        message.focus();
        error.textContent = "Please Enter a Message";
        return;
    }

    error.textContent = "";

    your_name.value = "";
    phone_number.value = "";
    your_email.value = "";
    message.value = "";

    alert("Message Sent!");
});




const menuToggle = document.getElementById("menu_toggle");
const mainHeader = document.querySelector(".main-ui > header");
const mainNav = mainHeader?.querySelector("nav");

if (menuToggle && mainHeader && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainHeader.classList.toggle("nav-open");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mainHeader.classList.remove("nav-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
            menuToggle.textContent = "☰";
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1000) {
            mainHeader.classList.remove("nav-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
            menuToggle.textContent = "☰";
        }
    });
}
