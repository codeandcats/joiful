import { testConstraintWithPojos, testConversionWithPojos } from '../testUtil';
import { Joiful } from '../../../src/joiful';

describe('string', () => {
    let jf: Joiful;

    beforeEach(() => jf = new Joiful());

    testConstraintWithPojos(
        () => {
            class ForgotPassword {
                @jf.string()
                username?: string;
            }
            return ForgotPassword;
        },
        [
            { username: 'joe' },
            {},
        ],
        [
            { username: 1 as any },
        ],
    );

    describe('alphanum', () => {
        testConstraintWithPojos(
            () => {
                class SetPasscode {
                    @jf.string().alphanum()
                    code?: string;
                }
                return SetPasscode;
            },
            [{ code: 'abcdEFG12390' }],
            [{ code: '!@#$' }],
        );
    });

    describe('creditCard', () => {
        testConstraintWithPojos(
            () => {
                class PaymentDetails {
                    @jf.string().creditCard()
                    creditCardNumber?: string;
                }
                return PaymentDetails;
            },
            [{ creditCardNumber: '4444333322221111' }],
            [
                { creditCardNumber: 'abcd' },
                { creditCardNumber: '1234' },
                { creditCardNumber: '4444-3333-2222-1111' },
            ],
        );
    });

    describe('email', () => {
        testConstraintWithPojos(
            () => {
                class ResetPassword {
                    @jf.string().email()
                    emailAddress?: string;
                }
                return ResetPassword;
            },
            [
                { emailAddress: 'monkey@see.com' },
                { emailAddress: 'howdy+there@pardner.co.kr' },
                { emailAddress: 'monkey@do' },
            ],
            [
                { emailAddress: '' },
                { emailAddress: '123.com' },
            ],
        );
    });

    describe('guid', () => {
        testConstraintWithPojos(
            () => {
                class ObjectWithId {
                    @jf.string().guid()
                    id?: string;
                }
                return ObjectWithId;
            },
            [
                { id: '3F2504E0-4F89-41D3-9A0C-0305E82C3301' },
                { id: '3f2504e0-4f89-41d3-9a0c-0305e82c3301' },
            ],
            [
                { id: '123' },
                { id: 'abc' },
            ],
        );
    });

    describe('hex', () => {
        testConstraintWithPojos(
            () => {
                class SetColor {
                    @jf.string().hex()
                    color?: string;
                }
                return SetColor;
            },
            [
                { color: 'AB' },
                { color: '0123456789abcdef' },
                { color: '0123456789ABCDEF' },
                { color: '123' },
                { color: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF' },
            ],
            [
                { color: '0xf' },
                { color: '0x0F' },
                { color: '0xAB' },
                { color: 'A B' },
                { color: 'jj' },
            ],
        );
    });

    describe('hostname', () => {
        testConstraintWithPojos(
            () => {
                class Server {
                    @jf.string().hostname()
                    hostName?: string;
                }
                return Server;
            },
            [
                { hostName: 'www.thisisnotarealdomainnameoratleastihopeitsnot.com.au' },
                { hostName: 'www.zxcv.ninja' },
                { hostName: '127.0.0.1' },
                { hostName: 'shonkydodgersprelovedautomobiles.ninja' },
            ],
            [
                { hostName: 'https://www.thisisnotarealdomainnameoratleastihopeitsnot.com.au' },
                { hostName: 'www.zxcv.ninja/hello' },
                { hostName: 'www.zxcv.ninja?query=meow' },
            ],
        );
    });

    describe('insensitive', () => {
        testConstraintWithPojos(
            () => {
                class UserRegistration {
                    @jf.string().allow(
                        'male',
                        'female',
                        'intersex',
                        'other',
                    ).insensitive()
                    gender?: string;
                }
                return UserRegistration;
            },
            [
                { gender: 'female' },
                { gender: 'FEMALE' },
                { gender: 'fEmAlE' },
            ],
        );
    });

    describe('ip', () => {
        describe('no options', () => {
            testConstraintWithPojos(
                () => {
                    class Server {
                        @jf.string().ip({ version: 'ipv4' })
                        ipAddress?: string;
                    }
                    return Server;
                },
                [
                    { ipAddress: '127.0.0.1' },
                    { ipAddress: '127.0.0.1/24' },
                ],
                [
                    { ipAddress: 'abc.def.ghi.jkl' },
                    { ipAddress: '123' },
                    { ipAddress: '2001:0db8:0000:0000:0000:ff00:0042:8329' },
                ],
            );
        });

        describe('ip', () => {
            describe('IPv4', () => {
                testConstraintWithPojos(
                    () => {
                        class Server {
                            @jf.string().ip({ version: 'ipv4' })
                            ipAddress?: string;
                        }
                        return Server;
                    },
                    [
                        { ipAddress: '127.0.0.1' },
                        { ipAddress: '127.0.0.1/24' },
                    ],
                    [
                        { ipAddress: '2001:0db8:0000:0000:0000:ff00:0042:8329' },
                    ],
                );
            });

            describe('IPv6', () => {
                testConstraintWithPojos(
                    () => {
                        class Server {
                            @jf.string().ip({ version: 'ipv6' })
                            ipAddress?: string;
                        }
                        return Server;
                    },
                    [
                        { ipAddress: '2001:0db8:0000:0000:0000:ff00:0042:8329' },
                        { ipAddress: '2001:db8:0:0:0:ff00:42:8329' },
                        { ipAddress: '2001:db8::ff00:42:8329' },
                        { ipAddress: '::1' },
                    ],
                    [
                        { ipAddress: '127.0.0.1' },
                        { ipAddress: '127.0.0.1/24' },
                    ],
                );
            });
        });

        describe('CIDR required', () => {
            testConstraintWithPojos(
                () => {
                    class Server {
                        @jf.string().ip({ cidr: 'required' })
                        ipAddress?: string;
                    }
                    return Server;
                },
                [
                    { ipAddress: '127.0.0.1/24' },
                ],
                [
                    { ipAddress: '127.0.0.1' },
                    { ipAddress: '2001:0db8:0000:0000:0000:ff00:0042:8329' },
                    { ipAddress: '2001:db8:abcd:8000::/50' },
                    { ipAddress: '2001:db8:abcd:8000::/50' },
                ],
            );
        });
    });

    describe('isoDate', () => {
        testConstraintWithPojos(
            () => {
                class AgeVerification {
                    @jf.string().isoDate()
                    dateOfBirth?: string;
                }
                return AgeVerification;
            },
            [
                { dateOfBirth: '2016-05-20' },
                { dateOfBirth: '2016-05-20T23:09:53+00:00' },
                { dateOfBirth: '2016-05-20T23:09:53Z' },
                { dateOfBirth: '2016-05-20T23:09:53' },
            ],
            [
                { dateOfBirth: '20-05-2016' },
                { dateOfBirth: '23:09:53' },
                { dateOfBirth: 'abcd' },
                { dateOfBirth: String(new Date().valueOf()) },
            ],
        );
    });

    describe('lowercase', () => {
        testConversionWithPojos({
            getClass: () => {
                class UserRegistration {
                    @jf.string().lowercase()
                    userName?: string;
                }
                return UserRegistration;
            },
            conversions: [
                {
                    input: { userName: 'ABCD123' },
                    output: { userName: 'abcd123' },
                },
            ],
            valid: [],
            invalid: [{ userName: 'INVALID' }],
        });
    });

    describe('max', () => {
        testConstraintWithPojos(
            () => {
                class UserRegistration {
                    @jf.string().max(10)
                    userName?: string;
                }
                return UserRegistration;
            },
            [{ userName: 'bobby' }],
            [{ userName: 'littlebobbytables' }],
        );
    });

    describe('min', () => {
        testConstraintWithPojos(
            () => {
                class UserRegistration {
                    @jf.string().min(5)
                    userName?: string;
                }
                return UserRegistration;
            },
            [{ userName: 'bobby' }, { userName: 'bobbyt' }],
            [{ userName: 'bob' }],
        );
    });

    const testRegEx = (alias: 'regex' | 'pattern') => {
        type RegExDecorator = ReturnType<typeof jf['string']>['regex'];

        describe(alias, () => {
            testConstraintWithPojos(
                () => {
                    class Authentication {
                        @(jf.string()[alias] as RegExDecorator)(/please/)
                        magicWord?: string;
                    }
                    return Authentication;
                },
                [
                    { magicWord: 'please' },
                    { magicWord: 'pretty-please' },
                    { magicWord: 'pleasewithcherriesontop' },
                ],
                [
                    { magicWord: 'letmein' },
                    { magicWord: 'PLEASE' },
                ],
            );

            testConstraintWithPojos(
                () => {
                    class Authentication {
                        @(jf.string()[alias] as RegExDecorator)(/please/i)
                        magicWord?: string;
                    }
                    return Authentication;
                },
                [
                    { magicWord: 'please' },
                    { magicWord: 'pretty-PLEASE' },
                ],
            );
        });
    };

    testRegEx('regex');
    testRegEx('pattern');

    describe('replace', () => {
        testConversionWithPojos({
            getClass: () => {
                class UserRegistration {
                    @jf.string().replace(/sex/g, 'gender')
                    userName?: string;
                }
                return UserRegistration;
            },
            conversions: [
                {
                    input: { userName: 'expertsexchange' },
                    output: { userName: 'expertgenderchange' },
                },
            ],
        });
    });

    describe('token', () => {
        testConstraintWithPojos(
            () => {
                class CodeSearch {
                    @jf.string().token()
                    identifier?: string;
                }
                return CodeSearch;
            },
            [
                { identifier: 'abcdEFG12390' },
                { identifier: '_' },
            ],
            [
                { identifier: '!@#$' },
                { identifier: ' ' },
            ],
        );
    });

    describe('trim', () => {
        testConversionWithPojos({
            getClass: () => {
                class Person {
                    @jf.string().trim()
                    name?: string;
                }
                return Person;
            },
            conversions: [
                {
                    input: { name: 'Joe' },
                    output: { name: 'Joe' },
                },
                {
                    input: { name: 'Joe ' },
                    output: { name: 'Joe' },
                },
                {
                    input: { name: ' Joe ' },
                    output: { name: 'Joe' },
                },
                {
                    input: { name: '\n\r\t\t\nJoe \t ' },
                    output: { name: 'Joe' },
                },
            ],
            valid: [
                { name: 'Joe' },
                { name: 'Joey Joe Joe' },
            ],
            invalid: [
                { name: ' Joe ' },
                { name: 'Joe ' },
                { name: ' ' },
                { name: 'Joe\t' },
                { name: '\nJoe' },
                { name: '\r' },
                { name: '' },
            ],
        });
    });

    describe('uppercase', () => {
        testConversionWithPojos({
            getClass: () => {
                class UserRegistration {
                    @jf.string().uppercase()
                    userName?: string;
                }
                return UserRegistration;
            },
            conversions: [
                {
                    input: { userName: 'abcd123' },
                    output: { userName: 'ABCD123' },
                },
            ],
            valid: [],
            invalid: [{ userName: 'invalid' }],
        });
    });

    describe('uri', () => {
        describe('with no options', () => {
            testConstraintWithPojos(
                () => {
                    class WebsiteRegistration {
                        @jf.string().uri()
                        url?: string;
                    }
                    return WebsiteRegistration;
                },
                [{ url: 'https://my.site.com' }],
                [
                    { url: '!@#$' },
                    { url: ' ' },
                ],
            );
        });

        describe('with a scheme', () => {
            testConstraintWithPojos(
                () => {
                    class MyClass {
                        @jf.string().uri({
                            scheme: 'git',
                        })
                        url?: string;
                    }
                    return MyClass;
                },
                [{ url: 'git://my.site.com' }],
                [{ url: 'https://my.site.com' }],
            );
        });
    });
});
