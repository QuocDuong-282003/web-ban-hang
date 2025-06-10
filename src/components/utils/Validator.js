// src/utils/validator.js
const Validator = (options) => {
    const formElement = document.querySelector(options.form); // Vẫn có thể dùng querySelector nếu rules được truyền trực tiếp vào component
    let selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        const errorElement = inputElement.closest(options.formGroupSelector).querySelector(options.errorSelector);
        let errorMessage;

        // Lấy ra các rules của selector
        const rules = selectorRules[rule.selector];

        // Lặp qua từng rule & kiểm tra
        // Nếu có lỗi thì dừng việc kiểm
        for (let i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.closest(options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.closest(options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // Hàm để sử dụng trong component React, trả về object lỗi
    function validateFormReact(formData, currentRules) {
        const errors = {};
        let formIsValid = true;

        currentRules.forEach((rule) => {
            const inputName = rule.selector.substring(1); // Bỏ dấu '#'
            const inputValue = formData[inputName] || (formData[rule.selector] || ''); // Lấy giá trị từ formData
            let errorForRule = null;

            const fieldRules = selectorRules[rule.selector];
            if (fieldRules) {
                for (let i = 0; i < fieldRules.length; ++i) {
                    // Với radio/checkbox, logic cần phức tạp hơn nếu validate group
                    // Hiện tại, giả sử rule áp dụng cho giá trị trực tiếp
                    if (rule.isRadioOrCheckboxGroup) { // Cần cờ này trong định nghĩa rule
                        // Ví dụ cho radio group (cần điều chỉnh cho phù hợp)
                        // Giả sử formData[inputName] chứa giá trị của radio group được chọn
                        errorForRule = fieldRules[i](formData[inputName]);
                    } else {
                        errorForRule = fieldRules[i](inputValue);
                    }
                    if (errorForRule) break;
                }
            }


            if (errorForRule) {
                errors[inputName] = errorForRule;
                formIsValid = false;
            }
        });
        return { errors, isValid: formIsValid };
    }


    // Lấy element của form cần validate
    if (formElement) { // Chỉ chạy nếu Validator được gọi theo cách cũ (cho HTML tĩnh)
        formElement.onsubmit = function (e) {
            e.preventDefault();
            let isFormValid = true;

            // Lặp qua từng rule và validate
            options.rules.forEach(function (rule) {
                const inputElement = formElement.querySelector(rule.selector);
                const isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Trường hợp submit với javascript
                if (typeof options.onSubmit === 'function') {
                    const enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    const formValues = Array.from(enableInputs).reduce(function (values, input) {
                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    // values[input.name] = ''; // Hoặc không thêm nếu không checked
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        }

        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
        options.rules.forEach(function (rule) {
            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            const inputElements = formElement.querySelectorAll(rule.selector); // Có thể có nhiều input cho 1 rule (vd: radio)

            Array.from(inputElements).forEach(function (inputElement) {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    const errorElement = inputElement.closest(options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.closest(options.formGroupSelector).classList.remove('invalid');
                }
            });
        });
    }


    // Trả về các hàm có thể dùng trong React components
    return {
        validateField: (fieldName, value, rulesForField) => {
            // rulesForField là một mảng các hàm test cho field đó
            for (const testFn of rulesForField) {
                const errorMessage = testFn(value);
                if (errorMessage) return errorMessage;
            }
            return null;
        },
        validateFormReact // Xuất hàm validate cho React
    };
};

// Định nghĩa rules (giữ nguyên từ validator.js gốc của bạn)
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Vui lòng nhập trường này'
        },
        isRadioOrCheckboxGroup: typeof selector === 'string' && selector.startsWith('input[name=') // Heuristic
    };
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    };
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}

Validator.isPhone = function (selector, message) { // Thêm rule isPhone nếu bạn có
    return {
        selector: selector,
        test: function (value) {
            const regex = /^(0[3|5|7|8|9])+([0-9]{8})\b$/; // Ví dụ regex SĐT Việt Nam
            return regex.test(value) ? undefined : message || 'Số điện thoại không hợp lệ';
        }
    }
}

export default Validator;